// ── PIPELINE PAUSADO ──────────────────────────────────────────────────────────
// Este endpoint forma parte del pipeline de datos de sector (staging → validación
// manual → producción). El enfoque original preveía cargar datos numéricos por
// rubro (CAME, INDEC) y validarlos antes de publicarlos en datos_sector.
//
// El pipeline está PAUSADO: el informe hoy usa contexto cualitativo generado
// por IA, sin depender de datos numéricos por rubro. El código se conserva
// por si se retoma la carga de datos numéricos en el futuro.
//
// Retomar implica: (1) implementar ingesta de datos (scraper/API/manual),
// (2) reemplazar auth x-admin-secret por un sistema real.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("datos_sector_staging")
    .select("*")
    .eq("estado", "pendiente")
    .order("fecha_parseo", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
