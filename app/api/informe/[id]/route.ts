import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generarInforme } from "@/lib/generarInforme";
import type { EncuestaRow, DatosSectorRow } from "@/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createServerClient();
  } catch {
    return NextResponse.json(
      { error: "Error de configuración del servidor" },
      { status: 500 }
    );
  }

  // Si el informe ya fue generado, lo devolvemos sin regenerar (evita costos extra)
  const { data: informeExistente } = await supabase
    .from("informes")
    .select("*")
    .eq("encuesta_id", id)
    .maybeSingle();

  if (informeExistente) {
    return NextResponse.json({ ok: true, informe: informeExistente });
  }

  // Traemos la encuesta
  const { data: encuesta, error: errorEncuesta } = await supabase
    .from("encuestas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (errorEncuesta || !encuesta) {
    return NextResponse.json(
      { error: "Encuesta no encontrada" },
      { status: 404 }
    );
  }

  // Buscamos datos del sector que correspondan al rubro seleccionado.
  // Si no existe fila para este rubro, generamos con fallback honesto (sin inventar datos).
  const { data: datosSector } = await supabase
    .from("datos_sector")
    .select("*")
    .eq("rubro_encuesta", encuesta.rubro)
    .maybeSingle();

  // Generamos el informe. La IA solo recibe datos que nosotros le pasamos —
  // nunca se le pide que complete o infiera datos del sector por su cuenta.
  let contenido;
  try {
    contenido = await generarInforme(
      encuesta as EncuestaRow,
      (datosSector as DatosSectorRow) ?? null
    );
  } catch (err) {
    console.error("Error generando informe:", err);
    // El lead ya quedó guardado en encuestas. No perdemos el contacto.
    return NextResponse.json(
      {
        error:
          "No pudimos generar el informe en este momento. Tu contacto quedó guardado y nos vamos a comunicar con vos.",
      },
      { status: 500 }
    );
  }

  // Guardamos el informe generado para no regenerarlo en visitas posteriores
  const { data: informeGuardado, error: errorGuardado } = await supabase
    .from("informes")
    .insert({
      encuesta_id: id,
      rubro_clasificado: datosSector?.rubro_display ?? encuesta.rubro,
      titulo: contenido.titulo,
      seccion_sector: contenido.seccion_sector,
      seccion_espejo: contenido.seccion_espejo,
      seccion_cierre: contenido.seccion_cierre,
      modelo_usado: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    })
    .select()
    .maybeSingle();

  if (errorGuardado) {
    // Si falla el guardado, igual devolvemos el contenido generado al usuario
    console.error("Error guardando informe:", errorGuardado);
    return NextResponse.json({ ok: true, informe: contenido });
  }

  return NextResponse.json({ ok: true, informe: informeGuardado });
}
