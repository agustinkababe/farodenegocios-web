import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import type { RespuestasEncuesta } from "@/types";

const CAMPOS_REQUERIDOS: (keyof RespuestasEncuesta)[] = [
  "rubro",
  "cantidad_empleados",
  "antiguedad",
  "canal_pedidos",
  "control_stock",
  "tiempo_respuesta",
  "vende_online",
  "tarea_repetitiva",
  "email",
];

export async function POST(request: Request) {
  const supabase = createServerClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  for (const campo of CAMPOS_REQUERIDOS) {
    if (!data[campo] || typeof data[campo] !== "string" || !(data[campo] as string).trim()) {
      return NextResponse.json({ error: `Falta el campo: ${campo}` }, { status: 400 });
    }
  }

  const email = (data.email as string).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // volumen_consultas y horas_tarea son opcionales: solo se persisten si el usuario respondió
  const volumenConsultas =
    typeof data.volumen_consultas === "string"
      ? (data.volumen_consultas as string).trim()
      : "";
  const horasTarea =
    typeof data.horas_tarea === "string"
      ? (data.horas_tarea as string).trim()
      : "";

  const { data: fila, error } = await supabase
    .from("encuestas")
    .insert({
      rubro: (data.rubro as string).trim(),
      cantidad_empleados: (data.cantidad_empleados as string).trim(),
      antiguedad: (data.antiguedad as string).trim(),
      canal_pedidos: (data.canal_pedidos as string).trim(),
      control_stock: (data.control_stock as string).trim(),
      tiempo_respuesta: (data.tiempo_respuesta as string).trim(),
      vende_online: (data.vende_online as string).trim(),
      tarea_repetitiva: (data.tarea_repetitiva as string).trim(),
      ...(volumenConsultas ? { volumen_consultas: volumenConsultas } : {}),
      ...(horasTarea ? { horas_tarea: horasTarea } : {}),
      email,
    })
    .select("id")
    .single();

  if (error || !fila) {
    console.error("Error insertando encuesta:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: fila.id });
}
