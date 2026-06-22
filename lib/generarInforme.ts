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
  // La capa de contexto se construye SOLO con datos que vienen de la DB.
  // En ningún caso se le pide a la IA que genere o complete cifras del sector.
  const bloqueContexto = datos
    ? `=== DATOS REALES DEL SECTOR (fuente: CAME) ===
Estos son los ÚNICOS datos de sector que podés citar. No podés agregar, inferir ni inventar cifras adicionales. Si algo no está acá, no existe para este informe.

Rubro: ${datos.rubro_display}
Variación interanual: ${datos.variacion_interanual !== null ? datos.variacion_interanual + "%" : "no disponible"}
Variación acumulada en el año: ${datos.variacion_acumulada !== null ? datos.variacion_acumulada + "%" : "no disponible"}
Período de referencia: ${datos.periodo}
${datos.notas ? "Contexto cualitativo: " + datos.notas : ""}`
    : `=== DATOS DEL SECTOR ===
No contamos aún con datos específicos para este rubro en nuestra base.
En la sección del sector, aclaralo honestamente y sin vueltas. Podés mencionar que el comercio minorista PyME en Argentina atraviesa un año difícil, pero sin inventar cifras ni porcentajes concretos que no tengas.`;

  const bloqueVolumen = respuestas.volumen_consultas
    ? `Volumen de consultas por día: ${respuestas.volumen_consultas}`
    : `Volumen de consultas por día: el usuario no lo indicó (dato no disponible)`;

  return `Sos un consultor que conoce de cerca el mundo de las PyMEs argentinas. Escribís diagnósticos honestos para dueños de negocios que no tienen tiempo ni plata para perder.

${bloqueContexto}

=== RESPUESTAS DEL NEGOCIO ===
Rubro: ${respuestas.rubro}
Personas en el negocio: ${respuestas.cantidad_empleados}
Antigüedad: ${respuestas.antiguedad}
Canal principal de pedidos o consultas: ${respuestas.canal_pedidos}
Control de stock: ${respuestas.control_stock}
Tiempo de respuesta a consultas: ${respuestas.tiempo_respuesta}
${bloqueVolumen}
Vende online: ${respuestas.vende_online}
Lo que más le pesa, en sus propias palabras: "${respuestas.tarea_repetitiva}"

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
Contextualizá el rubro con los datos del bloque de arriba.
- Si hay datos reales, usá la variación interanual, el período y las notas cualitativas. Esos son los únicos números que podés citar.
- Si no hay datos específicos, decilo con honestidad y hablá de tendencias generales sin inventar cifras.
- Sin encabezados adentro. Solo párrafos de texto.
- 2 a 3 párrafos cortos, separados por salto de línea doble.

---

CAMPO "seccion_espejo":
Esta sección arranca SIEMPRE del dolor que el usuario expresó en sus propias palabras. Es la parte más importante del informe.

PASO 1 — Escuchá primero:
Tomá exactamente lo que escribió en "Lo que más le pesa" y reflejalo. Nombralo como él lo dijo. Si dijo "mis ventas están muy bajas, antes había consultas pero hoy nadie compra", eso es lo que estás leyendo — no lo reinterpretés como "problema de stock" ni "gestión de consultas". El dolor que expresó manda.

PASO 2 — Contextualizá:
Conectá ese dolor con el contexto del sector y con las otras respuestas solo si tiene sentido real. Si el dolor es de demanda y los datos del sector confirman que el rubro está golpeado, decilo. Si el dolor es operativo, conectalo con lo operativo. No fuerces la conexión si no existe.

PASO 3 — Usá el volumen si corresponde:
Si el dolor expresado tiene que ver con consultas, atención o tiempo de respuesta, Y el dato de volumen está disponible, podés usarlo para dar dimensión concreta. Ejemplo de razonamiento permitido: "si manejás entre 30 y 50 consultas por día y respondés tarde, son varias ventas por semana que se enfrían". SIEMPRE presentalo como estimación aproximada ("pueden ser", "eso equivale a más o menos"), NUNCA como cifra exacta. Si el dato de volumen no está disponible, o si el dolor NO tiene que ver con consultas, no lo uses.

PASO 4 — Sin cifras inventadas:
Si no tenés un dato cuantitativo real del usuario, no lo inventes. Quedate en lo cualitativo. Nunca fabules plata ni horas aunque "suenen bien".

- Sin encabezados adentro. Solo párrafos de texto.
- 2 a 3 párrafos cortos, separados por salto de línea doble.

---

CAMPO "seccion_cierre":
Arrancá del dolor específico que expresó el usuario — no de lo que podría ofrecer fiable.

Si el dolor es operativo (algo que proceso o tecnología puede resolver): conectalo directamente con cómo fiable trabaja ese tipo de problema en PyMEs y terminá firme.

Si el dolor es de mercado (caída de ventas, falta de demanda): reconocé que no todo se resuelve con tecnología — eso es honesto y el usuario lo va a valorar — pero no te quedes ahí. Hacé el puente: en momentos de ajuste, lo que queda bajo el control del dueño es operar más eficiente para aprovechar mejor cada consulta que llega y reducir lo que se pierde por fricción. Terminá firme en que fiable puede ayudar con esa parte.

REGLA DEL CIERRE: El tono debe ser honesto pero confiado. Nunca terminar con dudas ("quizás", "no sé si", "depende"). Si hay algo que fiable no resuelve, decilo en el medio — pero el párrafo final siempre termina afirmando lo que sí se puede hacer. Honestidad sí, tibieza no.

fiable = estudio que desarrolla soluciones tecnológicas a medida para PyMEs argentinas. Mencionalo de forma coherente con el dolor expresado, nunca como si fuera una solución genérica.

Sin casos puntuales inventados. Solo afirmaciones generales verdaderas y confiadas.

- Sin encabezados adentro. Solo párrafos de texto.
- 1 a 2 párrafos cortos.

---

TONO para todos los campos:
Hablale como a un conocido que tiene un comercio. Directo, sin vueltas. "Mirá, la realidad es...", "lo que te está pesando...", "en este contexto...". Tuteá siempre. Sin "implementar estrategias", sin "optimizar procesos", sin "emprendimiento", sin "ecosistema". El informe acompaña — no vende, no alecciona.

REGLA ABSOLUTA: Cero cifras inventadas. Si no tenés el dato real, no lo ponés. Si estimás algo, lo aclarás explícitamente con palabras como "pueden ser" o "más o menos". Nunca presentés una inferencia como un dato cierto.`;
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
