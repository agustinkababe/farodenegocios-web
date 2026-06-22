import { createOpenAIClient, OPENAI_MODEL } from "./openai";
import type { RespuestasEncuesta, DatosSectorRow } from "@/types";

export type ContenidoInforme = {
  titulo: string;
  seccion_sector: string;
  seccion_espejo: string;
  seccion_cierre: string;
};

function buildPrompt(
  respuestas: RespuestasEncuesta,
  datos: DatosSectorRow | null
): string {
  // La capa de contexto es ahora cualitativa y funciona para cualquier rubro.
  // Si hay dato cargado en la DB lo usa como apoyo; si no, caracteriza con honestidad general.
  // En ningún caso se le pide a la IA que invente cifras exactas.
  const bloqueContexto = datos
    ? `=== CONTEXTO DEL SECTOR (fuente: ${datos.fuente}) ===
Estos son los únicos datos de sector que podés citar. No podés agregar, inferir ni inventar cifras adicionales.

Rubro: ${datos.rubro_display}
${datos.nota_cualitativa ? "Caracterización: " + datos.nota_cualitativa : ""}
${datos.variacion_interanual !== null ? "Variación interanual registrada: " + datos.variacion_interanual + "% (período: " + datos.mes_referencia + ")" : ""}
${datos.variacion_acumulada_anio !== null ? "Variación acumulada en el año: " + datos.variacion_acumulada_anio + "%" : ""}`
    : `=== CONTEXTO DEL SECTOR ===
No contamos con datos específicos de este rubro en nuestra base.
Para la sección del sector, hacé una caracterización honesta y general del comercio PyME argentino:
contexto de caída del consumo, inflación, la digitalización como uno de los pocos vectores de crecimiento.
Podés mencionar tendencias generales del rubro del usuario (alimentos, indumentaria, servicios, etc.)
basándote en lo que es verdad estable y conocida. Pero NUNCA inventés un porcentaje exacto ni lo presentés
como dato concreto. Podés decir "viene golpeado", "de los más afectados", "tuvo un 2024 difícil",
o "lo digital es de lo poco que crece" — eso es verdad general y no requiere fuente específica.`;

  // Bloque de impacto cuantitativo: combina volumen + horas si el usuario los proporcionó.
  // Solo se usa si el dolor expresado en tarea_repetitiva está relacionado con estos números.
  const tieneVolumen = !!respuestas.volumen_consultas;
  const tieneHoras = !!respuestas.horas_tarea;
  const bloqueImpacto =
    tieneVolumen || tieneHoras
      ? `Datos de impacto del dolor (rangos aproximados dados por el usuario):
${tieneVolumen ? "Volumen de consultas/clientes por día: " + respuestas.volumen_consultas : ""}
${tieneHoras ? "Horas semanales que consume la tarea que más le pesa: " + respuestas.horas_tarea : ""}`
      : `Datos de impacto del dolor: el usuario no proporcionó volumen ni horas — no disponible, no inventar.`;

  return `Sos un consultor que conoce de cerca el mundo de las PyMEs argentinas. Escribís diagnósticos honestos para dueños de negocios que no tienen tiempo ni plata para perder.

${bloqueContexto}

=== RESPUESTAS DEL NEGOCIO ===
Rubro: ${respuestas.rubro}
Personas en el negocio: ${respuestas.cantidad_empleados}
Antigüedad: ${respuestas.antiguedad}
Canal principal de pedidos o consultas: ${respuestas.canal_pedidos}
Control de stock: ${respuestas.control_stock}
Tiempo de respuesta a consultas: ${respuestas.tiempo_respuesta}
Vende online: ${respuestas.vende_online}
Lo que más le pesa, en sus propias palabras: "${respuestas.tarea_repetitiva}"

${bloqueImpacto}

=== TAREA ===
Escribí un diagnóstico en JSON con exactamente estos cuatro campos. Cada campo contiene SOLO el texto del cuerpo — sin títulos, sin subtítulos, sin negritas, sin asteriscos, sin encabezados de ningún tipo. Los títulos los pone el front-end, no vos.

{
  "titulo": "...",
  "seccion_sector": "...",
  "seccion_espejo": "...",
  "seccion_cierre": "..."
}

---

CAMPO "titulo":
Una frase corta y específica para este negocio. Sin "Tu diagnóstico:" al principio. Que nombre el rubro y el momento. Ejemplo: "Bazar y deco: cómo están los números y qué hacer con eso". Una oración, sin punto final.

---

CAMPO "seccion_sector":
Describí el momento del sector del usuario con honestidad.
- Si hay datos de sector en el bloque de arriba, usá la caracterización y los números (si existen). Esos son los únicos datos que podés citar con precisión.
- Si no hay datos específicos, hacé una caracterización honesta y general del comercio PyME argentino en el rubro del usuario: contexto macro, qué está golpeado, qué resiste. Podés afirmar verdades generales sin inventar cifras.
- NUNCA inventes un porcentaje exacto ni lo presentés como dato preciso si no lo tenés respaldado.
- Sin encabezados adentro. Solo párrafos de texto.
- 2 a 3 párrafos cortos, separados por salto de línea doble.

---

CAMPO "seccion_espejo":
Esta sección arranca SIEMPRE del dolor que el usuario expresó en sus propias palabras. Es la parte más importante del informe.

PASO 1 — Escuchá primero:
Tomá exactamente lo que escribió en "Lo que más le pesa" y reflejalo. Nombralo como él lo dijo. Si dijo "mis ventas están muy bajas, antes había consultas pero hoy nadie compra", eso es lo que estás leyendo — no lo reinterpretés como "problema de stock" ni "gestión de consultas". El dolor que expresó manda.

PASO 2 — Contextualizá:
Conectá ese dolor con el contexto del sector y con las otras respuestas solo si tiene sentido real. Si el dolor es de demanda y el sector confirma que está golpeado, decilo. Si el dolor es operativo, conectalo con lo operativo. No fuerces la conexión si no existe.

PASO 3 — Cuantificá el dolor si tenés los datos:
Si el usuario indicó volumen de consultas Y/O horas dedicadas a la tarea, usá esos rangos para dar dimensión concreta al dolor. Hacélo solo si el dolor expresado tiene relación directa con esos números (si habló de responder consultas, de una tarea que le consume tiempo, etc.).
Ejemplo de razonamiento permitido: "si manejás entre 30 y 50 consultas por día y esto te come entre 10 y 20 horas semanales, son casi dos días de trabajo por semana en algo que no genera una venta extra".
SIEMPRE presentalo como estimación aproximada con palabras como "unas", "entre", "más o menos", "pueden ser". NUNCA como cifra exacta. Si no tenés esos datos, o si el dolor no está relacionado, omitílo.

PASO 4 — Sin cifras inventadas:
Si no tenés un dato cuantitativo real del usuario, quedate en lo cualitativo. Nunca fabules plata ni horas aunque "suenen bien".

- Sin encabezados adentro. Solo párrafos de texto.
- 2 a 3 párrafos cortos, separados por salto de línea doble.

---

CAMPO "seccion_cierre":
Este campo planta el DESEO de la categoría: que el dueño quiera resolver su dolor con tecnología.
NO menciona ninguna empresa, NO tiene CTA, NO nombra proveedores. Es contenido puro.

PASO 1 — Conectá el dolor con la palanca que el dueño tiene:
En tiempos de ajuste, lo que queda bajo el control del dueño no es la macro ni la demanda — es cómo opera. Aprovechá mejor cada consulta que llega. Dejá de gastar tiempo en lo que no vende.
Si el dolor es de mercado (caída de ventas, falta de demanda): reconocelo primero, sin mentirle. Pero no te quedes ahí: hacé el puente hacia lo que sí puede cambiar.

PASO 2 — Hacé visible la solución:
Describí en lenguaje concreto y simple qué resolvería el dolor puntual que expresó. Que el dueño pueda VISUALIZAR cómo cambiaría su día a día. Sin nombrar empresas ni productos. Solo describir QUÉ haría la solución:
- Si el dolor es responder siempre lo mismo por WhatsApp → "algo que conteste solo las preguntas repetidas de precios y horarios, para que dejes de escribir lo mismo todo el día"
- Si el dolor es el control de stock → "un sistema donde cargás una venta y el stock se actualiza solo, sin planillas"
- Si el dolor es cargar pedidos → "un flujo donde el pedido llega directo al sistema, sin recargar nada a mano"

PASO 3 — Planta la idea de accesibilidad:
Cerrá con la idea de que este tipo de solución — tecnología hecha para resolver un proceso específico de un negocio — antes era cara y exclusiva de las empresas grandes. Eso cambió: hoy se puede construir algo así a una fracción del costo anterior, y un negocio como el del usuario tiene acceso a eso. Confiado, sin exagerar, sin inventar cifras.

REGLA ABSOLUTA: NO mencionar "fiable" ni ninguna empresa. NO inventar casos ni cifras. Solo afirmaciones verdaderas.

- Sin encabezados adentro. Solo párrafos de texto.
- 2 párrafos cortos.

---

TONO para todos los campos:
Hablale como a un conocido que tiene un comercio. Directo, sin vueltas. "Mirá, la realidad es...", "lo que te está pesando...", "en este contexto...". Tuteá siempre. Sin "implementar estrategias", sin "optimizar procesos", sin "emprendimiento", sin "ecosistema". El informe acompaña — no vende, no alecciona.

REGLA ABSOLUTA: Cero cifras inventadas. Si no tenés el dato real, no lo ponés. Si estimás algo del usuario, lo aclarás con "unas", "entre", "más o menos". Nunca presentés una inferencia como un dato cierto.`;
}

export async function generarInforme(
  respuestas: RespuestasEncuesta,
  datos: DatosSectorRow | null
): Promise<ContenidoInforme> {
  const openai = createOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "user", content: buildPrompt(respuestas, datos) }],
    temperature: 0.65,
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

  for (const campo of ["titulo", "seccion_sector", "seccion_espejo", "seccion_cierre"]) {
    if (typeof parsed[campo] !== "string" || !(parsed[campo] as string).trim()) {
      throw new Error(`Campo faltante o vacío en respuesta de IA: ${campo}`);
    }
  }

  return {
    titulo: (parsed.titulo as string).trim(),
    seccion_sector: (parsed.seccion_sector as string).trim(),
    seccion_espejo: (parsed.seccion_espejo as string).trim(),
    seccion_cierre: (parsed.seccion_cierre as string).trim(),
  };
}
