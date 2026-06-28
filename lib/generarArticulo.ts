import { createHash } from "crypto";
import { createOpenAIClient } from "./openai";
import type { ArticuloTemaRow } from "@/types";

const OPENAI_MODEL_ARTICULOS =
  process.env.OPENAI_MODEL_ARTICULOS ??
  process.env.OPENAI_MODEL ??
  "gpt-4o-mini";

// ── Utilidades ─────────────────────────────────────────────────────────────────

function normalizar(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashTitulo(titulo: string): string {
  return createHash("sha256").update(normalizar(titulo)).digest("hex").slice(0, 32);
}

export function generarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// ── Proponer lote de temas ─────────────────────────────────────────────────────

export type TemaGenerado = {
  titulo: string;
  tipo: "educativo" | "coyuntura" | "como-hacer" | "casos";
};

export async function proponerTemas(): Promise<TemaGenerado[]> {
  const openai = createOpenAIClient();

  const prompt = `Sos editor de contenido para Faro de Negocios, un portal de diagnóstico gratuito para PyMEs argentinas.

Tu tarea: proponé 36 temas para artículos de blog útiles para dueños de pequeños comercios y negocios en Argentina.

TIPOS Y DISTRIBUCIÓN:
- 10-12 temas tipo "educativo": atemporales, conceptuales, verdaderos por definición. Sin estadísticas. Qué es algo, señales de que algo no funciona, diferencias entre opciones, guías de conceptos.
- 8-10 temas tipo "como-hacer": paso a paso, accionables, cómo hacer una tarea concreta. El título arranca con "Cómo" o describe una acción.
- 6-8 temas tipo "casos": historias ilustrativas de situaciones que reconocerá un dueño de PyME. El título describe una situación o un personaje tipo ("La ferretería que dejó de perder pedidos").
- 5-7 temas tipo "coyuntura": contexto económico, tendencias del momento, comportamientos del consumidor argentino. Requieren datos reales al escribirse.

TONO EN LOS TÍTULOS:
- Que suenen como algo que un dueño de PyME se preguntaría o reconocería.
- Lenguaje argentino directo. Sin "estrategias", "ecosistema", "emprendimiento", "metodologías".
- BIEN: "Cómo saber si necesitás un sistema de stock", "La distribuidora que pasó de Excel al caos a tener todo ordenado", "Señales de que perdés ventas por WhatsApp".
- MAL: "Optimización de procesos en la cadena de valor PyME", "Estrategias digitales para el ecosistema emprendedor".

Devolvé SOLO este JSON exacto, sin texto ni comentarios extra:
{
  "temas": [
    { "titulo": "...", "tipo": "educativo" },
    { "titulo": "...", "tipo": "como-hacer" },
    { "titulo": "...", "tipo": "casos" },
    { "titulo": "...", "tipo": "coyuntura" }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL_ARTICULOS,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("La IA no devolvió contenido");

  let parsed: { temas?: unknown[] };
  try {
    parsed = JSON.parse(raw) as { temas?: unknown[] };
  } catch {
    throw new Error("La IA devolvió JSON inválido");
  }

  if (!Array.isArray(parsed.temas)) {
    throw new Error("La IA no devolvió el array 'temas'");
  }

  const temas: TemaGenerado[] = [];
  for (const item of parsed.temas) {
    const t = item as Record<string, unknown>;
    if (
      typeof t.titulo === "string" &&
      (t.tipo === "educativo" || t.tipo === "coyuntura" || t.tipo === "como-hacer" || t.tipo === "casos")
    ) {
      temas.push({ titulo: t.titulo.trim(), tipo: t.tipo });
    }
  }

  if (temas.length < 10) {
    throw new Error(`La IA devolvió solo ${temas.length} temas válidos`);
  }

  return temas;
}

// ── Imagen de portada vía Unsplash ─────────────────────────────────────────────

type PortadaResultado = {
  url: string;
  credito: string;
} | null;

async function buscarPortadaConTermino(
  query: string,
  key: string
): Promise<PortadaResultado> {
  try {
    const utm = "utm_source=farodenegocios&utm_medium=referral";
    const resp = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!resp.ok) return null;

    const data = (await resp.json()) as {
      results?: Array<{
        id: string;
        urls: { regular: string };
        user: { name: string; links: { html: string } };
        links: { html: string };
      }>;
    };

    const photo = data.results?.[0];
    if (!photo) return null;

    // Requerido por los términos de uso de Unsplash: trigger del endpoint de descarga
    fetch(`https://api.unsplash.com/photos/${photo.id}/download`, {
      headers: { Authorization: `Client-ID ${key}` },
    }).catch(() => {});

    const credito = JSON.stringify({
      nombre: photo.user.name,
      perfil_url: `${photo.user.links.html}?${utm}`,
      foto_url: `${photo.links.html}?${utm}`,
    });

    return { url: photo.urls.regular, credito };
  } catch {
    return null;
  }
}

/**
 * Busca portada con cascada de términos: keyword específica → primer término → genéricos.
 * Retorna null solo si ningún término en toda la cascada devuelve resultados.
 */
export async function buscarPortada(keywords: string): Promise<PortadaResultado> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  // Cascada: keyword completa → primera palabra → genéricos de respaldo
  const cascade = new Set<string>([
    keywords.trim(),
    keywords.trim().split(/\s+/)[0],
    "small business",
    "shop interior",
    "store",
  ]);

  for (const termino of cascade) {
    const resultado = await buscarPortadaConTermino(termino, key);
    if (resultado) return resultado;
  }

  return null;
}

// ── Generar artículo a partir de un tema aprobado ──────────────────────────────

export type ArticuloGenerado = {
  titulo: string;
  cuerpo: string;
  portada_url: string | null;
  portada_keywords: string | null;
  portada_credito: string | null;
};

export async function generarArticulo(
  tema: Pick<ArticuloTemaRow, "titulo" | "tipo">,
  modo: "auto" | "manual" = "auto"
): Promise<ArticuloGenerado> {
  const openai = createOpenAIClient();

  const instruccionTipo = (() => {
    switch (tema.tipo) {
      case "coyuntura":
        return modo === "manual"
          ? `Este artículo es de "coyuntura". Si necesitás un dato concreto (porcentaje, variación, número estadístico), dejá un placeholder así: [DATO: descripción exacta del dato que va acá]. NUNCA pongas un número fabricado. Una cifra inventada publicada como real hace daño concreto.`
          : `Este artículo es de "coyuntura" en modo automático. Escribís sobre el contexto del mercado de forma CUALITATIVA y honesta. Podés decir "los costos no paran de subir", "el consumo sigue contraído", "cada vez más clientes comparan precios online antes de comprar" — esas son verdades estables que no requieren fuente. PROHIBIDO inventar porcentajes, variaciones o cifras. Si no tenés el dato exacto, describí la tendencia de forma honesta y general.`;
      case "como-hacer":
        return `Este artículo es de tipo "como-hacer": una guía paso a paso, accionable. El lector tiene que poder hacer algo concreto después de leerlo.

ESTRUCTURA ESPECÍFICA para "como-hacer":
- Introducción: 1 párrafo que describe el problema que resuelve esta guía (ya dentro del problema, no presentando)
- Pasos numerados: entre 4 y 7 pasos. Cada paso va en su propio párrafo, empezando con **Paso N:** en negrita, seguido del texto del paso. Sin usar ## ni ###.
- Cada paso es corto y concreto: qué hacer, no por qué hacer algo
- Cierre con el bloque ¿Y tu negocio? (ver Regla 5)
- Total: 450-650 palabras`;
      case "casos":
        return `Este artículo es de tipo "casos": una historia ilustrativa de una situación que reconocerá un dueño de PyME.

REGLA CRÍTICA para "casos": Esta historia es un CASO ILUSTRATIVO, no un caso real verificable. El artículo DEBE aclararlo al principio, de forma natural y sin quitarle fuerza a la historia. Ejemplo de apertura: "Imaginá el caso de una ferretería..." o "Este es el tipo de situación que se repite..." — aclaraciones honestas que no destruyen la narrativa.

PROHIBIDO ABSOLUTAMENTE:
- Nombrar una empresa real o verificable ("La Ferretería González de Rosario")
- Afirmar que esto pasó de verdad ("le pasó a un cliente nuestro en 2023")
- Dar detalles verificables (barrio exacto + rubro + nombre del dueño)
- Citar resultados con cifras exactas ("aumentó sus ventas un 40%")

ESTRUCTURA ESPECÍFICA para "casos":
- Apertura: presentá la situación con la aclaración honesta (es ilustrativa, no real) — 1 párrafo
- Desarrollo: contá la historia en 3-4 párrafos: el problema, el momento de decisión, el cambio
- No uses datos inventados; describí mejoras de forma cualitativa ("empezó a responder más rápido", "dejó de perder pedidos")
- Cierre con el bloque ¿Y tu negocio? (ver Regla 5)
- Total: 450-600 palabras`;
      default:
        return `Este artículo es "educativo" — es ATEMPORAL. Enseñás "cómo hacer / cómo detectar / cómo decidir". Sin anclar en fechas ni en el estado actual del mercado. Podés mencionar el contexto de forma honesta y general ("en un contexto donde los costos no paran de subir", "cuando los márgenes están apretados") — eso es verdad estable, no invención.`;
    }
  })();

  const prompt = `Sos redactor de contenido para Faro de Negocios, un portal de diagnóstico para PyMEs argentinas. Escribís artículos útiles para dueños de pequeños comercios.

TEMA: ${tema.titulo}
TIPO: ${tema.tipo}

════════════════════════════════════════════
REGLA 1 — CERO DATOS INVENTADOS (sin excepción de tipo)
════════════════════════════════════════════

PROHIBIDO en cualquier tipo de artículo:
- Afirmar que "en 2023" / "en 2024" / "en [año concreto]" pasó algo en el mercado, en el consumo o en el sector. Las cifras históricas inventadas son igual de falsas que las actuales.
- Inventar porcentajes, cifras o estadísticas aunque suenen razonables ("el 60% de las PyMEs…", "las ventas cayeron un 15%…").
- Usar "actualmente", "este año", "en los últimos meses", "la tendencia que se observa es X" — a menos que sea una verdad estable y general que no requiera fuente ("los costos siguen subiendo", "cada vez más clientes compran online").
- Afirmar hechos del presente como si los conocieras: vos no tenés acceso a datos del mercado en tiempo real.

${instruccionTipo}

════════════════════════════════════════════
REGLA 2 — CONCRETO Y ARGENTINO, NUNCA GENÉRICO
════════════════════════════════════════════

PROHIBIDO el registro "blog de negocios de manual":
- "Escuchá a tus clientes y adaptate a sus necesidades"
- "La clave es la constancia y la organización"
- "En el mundo actual, la tecnología es fundamental para cualquier negocio"
- "Sé proactivo y buscá oportunidades de mejora continua"
- Cualquier consejo que aplique igual a una startup de Silicon Valley y a un almacén de Villa Crespo

LO QUE SÍ — situaciones del día a día de una PyME argentina real:
- El pedido por WhatsApp que se perdió entre los chats del grupo familiar
- El stock que "más o menos me lo manejo en la cabeza o en un Excel que ya no entiendo"
- La temporada de diciembre que revienta y el enero que lo deja seco
- El precio que no sabés si actualizar o perder ventas frente a la competencia
- El cliente que pregunta el horario cinco veces y a vos te come 20 minutos del día
- La herramienta que prometía resolver todo y terminó siendo otro problema

Que un dueño lea el artículo y piense: "esto es exactamente lo que me pasa."
Que aprenda algo o pueda tomar una decisión después de leerlo.

════════════════════════════════════════════
REGLA 3 — TONO: EL ASESOR VETERANO, NO EL COACH
════════════════════════════════════════════

- Hablás como alguien que conoce el negocio de adentro, no como alguien que leyó sobre él
- Sin motivación vacía: no "¡podés lograrlo!", no "el camino al éxito empieza hoy"
- Sin corporativo: no "implementar una estrategia", no "optimizar el ecosistema de valor"
- Sin neutro universal: esto es Argentina, son PyMEs argentinas, el contexto es argentino
- Tuteás siempre, sin distancia, de igual a igual
- No arrancás con relleno de apertura ("En el dinámico mundo de...", "Hoy más que nunca...", "Si sos dueño de un negocio, seguramente...")
- El primer párrafo ya está dentro del problema, no presentando el tema

════════════════════════════════════════════
REGLA 4 — ESTRUCTURA (aplica salvo que el tipo tenga estructura propia)
════════════════════════════════════════════

- Introducción directa: 1 párrafo, desde la primera oración ya estás en el problema concreto
- Desarrollo: 3-5 párrafos cortos y bien separados, cada uno con una idea
- Sin H2 ni H3 internos (no uses ## ni ### en ningún lugar del cuerpo)
- Total: 450-650 palabras

════════════════════════════════════════════
REGLA 5 — CIERRE OBLIGATORIO: FORMATO EXACTO
════════════════════════════════════════════

El artículo SIEMPRE termina con este bloque. Copiá el formato exactamente:

¿Y tu negocio?

[1-2 oraciones que conecten el tema del artículo con el diagnóstico gratuito. Concretas, sin presión, que suenen a propuesta real.]

[Hacé el diagnóstico gratis →](/encuesta)

ATENCIÓN: el link \`[Hacé el diagnóstico gratis →](/encuesta)\` es FIJO e INNEGOCIABLE. Si ese link no aparece en markdown exactamente así, el artículo está incompleto.

════════════════════════════════════════════
FORMATO DE RESPUESTA
════════════════════════════════════════════

Devolvé SOLO este JSON, sin texto extra ni markdown wrapper:
{
  "titulo": "título final del artículo (puede ajustarse levemente para sonar natural)",
  "cuerpo": "el artículo completo en markdown. Párrafos separados por línea en blanco. Sin ## ni ### en ningún lugar. Cierre con el bloque ¿Y tu negocio? + link exacto a /encuesta.",
  "portada_keywords": "1-2 palabras clave en inglés para buscar imagen de portada en Unsplash. Que sea visual, concreto, evitá abstracciones. Ejemplos: 'small shop counter', 'whatsapp phone business', 'warehouse shelves', 'notebook calculator desk'. Máximo 4 palabras."
}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL_ARTICULOS,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("La IA no devolvió contenido");

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("La IA devolvió JSON inválido");
  }

  if (typeof parsed.titulo !== "string" || !parsed.titulo.trim()) {
    throw new Error("La IA no devolvió el campo 'titulo'");
  }
  if (typeof parsed.cuerpo !== "string" || !parsed.cuerpo.trim()) {
    throw new Error("La IA no devolvió el campo 'cuerpo'");
  }

  const titulo = (parsed.titulo as string).trim();
  const cuerpo = (parsed.cuerpo as string).trim();
  const portadaKeywords =
    typeof parsed.portada_keywords === "string" && parsed.portada_keywords.trim()
      ? parsed.portada_keywords.trim()
      : null;

  const portada = portadaKeywords ? await buscarPortada(portadaKeywords) : null;

  return {
    titulo,
    cuerpo,
    portada_url: portada?.url ?? null,
    portada_keywords: portadaKeywords,
    portada_credito: portada?.credito ?? null,
  };
}
