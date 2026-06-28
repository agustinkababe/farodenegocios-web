import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { buscarPortada } from "@/lib/generarArticulo";

export const maxDuration = 60;

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// Re-busca imagen para todos los artículos sin portada_url.
// Procesa de a uno con pausa entre llamadas para respetar rate limits de Unsplash.
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: sinImagen, error } = await supabase
    .from("articulos")
    .select("id, titulo, portada_keywords")
    .is("portada_url", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!sinImagen || sinImagen.length === 0) {
    return NextResponse.json({ ok: true, procesados: 0, mensaje: "Todos los artículos ya tienen imagen." });
  }

  const resultados: Array<{ id: string; titulo: string; encontrada: boolean }> = [];

  for (const art of sinImagen) {
    const keywords = art.portada_keywords ?? art.titulo;
    const portada = await buscarPortada(keywords);

    if (portada) {
      await supabase
        .from("articulos")
        .update({ portada_url: portada.url, portada_credito: portada.credito })
        .eq("id", art.id);
    }

    resultados.push({ id: art.id, titulo: art.titulo, encontrada: !!portada });

    // Pausa entre artículos para no saturar la API de Unsplash
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({
    ok: true,
    procesados: resultados.length,
    con_imagen: resultados.filter((r) => r.encontrada).length,
    sin_imagen: resultados.filter((r) => !r.encontrada).length,
    detalle: resultados,
  });
}
