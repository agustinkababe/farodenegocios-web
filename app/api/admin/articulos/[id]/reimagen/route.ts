import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { buscarPortada } from "@/lib/generarArticulo";

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// Re-busca la imagen de portada para un artículo (sin regenerar contenido).
// Usa la cascada completa: keyword guardada → primer término → genéricos.
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createServerClient();

  const { data: art, error } = await supabase
    .from("articulos")
    .select("id, titulo, portada_keywords")
    .eq("id", id)
    .maybeSingle();

  if (error || !art) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
  }

  const keywords = art.portada_keywords ?? art.titulo;
  const portada = await buscarPortada(keywords);

  const { error: updateError } = await supabase
    .from("articulos")
    .update({
      portada_url: portada?.url ?? null,
      portada_credito: portada?.credito ?? null,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    portada_url: portada?.url ?? null,
    encontrada: !!portada,
  });
}
