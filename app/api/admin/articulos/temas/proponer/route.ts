import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { proponerTemas, hashTitulo } from "@/lib/generarArticulo";

export const maxDuration = 60; // Requiere Vercel Pro; en local no aplica.

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 1. Generar propuestas con IA
  let propuestas;
  try {
    propuestas = await proponerTemas();
  } catch (e) {
    console.error("[proponer-temas]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error generando temas" },
      { status: 500 }
    );
  }

  // 2. Calcular hashes y filtrar duplicados contra la DB
  const supabase = createServerClient();
  const hashes = propuestas.map((t) => hashTitulo(t.titulo));

  const { data: existentes } = await supabase
    .from("articulos_temas")
    .select("hash")
    .in("hash", hashes);

  const hashesExistentes = new Set((existentes ?? []).map((r) => r.hash));

  const nuevos = propuestas
    .map((t) => ({ ...t, hash: hashTitulo(t.titulo) }))
    .filter((t) => !hashesExistentes.has(t.hash));

  if (nuevos.length === 0) {
    return NextResponse.json({ ok: true, insertados: 0, duplicados: propuestas.length });
  }

  // 3. Insertar los no-duplicados
  const { error: insertError } = await supabase
    .from("articulos_temas")
    .insert(
      nuevos.map((t) => ({
        titulo: t.titulo,
        tipo: t.tipo,
        estado: "propuesto",
        hash: t.hash,
      }))
    );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    insertados: nuevos.length,
    duplicados: propuestas.length - nuevos.length,
  });
}
