import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generarArticulo, hashTitulo, generarSlug } from "@/lib/generarArticulo";

export const maxDuration = 60; // Requiere Vercel Pro; en local no aplica.

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createServerClient();

  // 1. Cargar el tema y verificar que esté aprobado
  const { data: tema, error: temaError } = await supabase
    .from("articulos_temas")
    .select("id, titulo, tipo, estado")
    .eq("id", id)
    .maybeSingle();

  if (temaError || !tema) {
    return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  }
  if (tema.estado !== "aprobado") {
    return NextResponse.json(
      { error: `El tema está en estado '${tema.estado}'. Solo se generan artículos de temas aprobados.` },
      { status: 400 }
    );
  }

  // 2. Verificar que no exista ya un artículo con el mismo tema_id
  const { data: artExistente } = await supabase
    .from("articulos")
    .select("id, estado")
    .eq("tema_id", id)
    .maybeSingle();

  if (artExistente) {
    return NextResponse.json(
      { error: `Ya existe un artículo para este tema (estado: ${artExistente.estado}). ID: ${artExistente.id}` },
      { status: 409 }
    );
  }

  // 3. Generar con IA
  let generado;
  try {
    generado = await generarArticulo({ titulo: tema.titulo, tipo: tema.tipo }, "manual");
  } catch (e) {
    console.error("[generar-articulo]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error generando artículo" },
      { status: 500 }
    );
  }

  // 4. Verificar hash del título generado (dedup por contenido)
  const hash = hashTitulo(generado.titulo);
  const { data: hashExistente } = await supabase
    .from("articulos")
    .select("id")
    .eq("hash", hash)
    .maybeSingle();

  if (hashExistente) {
    return NextResponse.json(
      { error: "Ya existe un artículo con un título muy similar. Revisá manualmente." },
      { status: 409 }
    );
  }

  // 5. Slug único (agrega sufijo numérico si ya existe)
  let slug = generarSlug(generado.titulo);
  const { data: slugExistente } = await supabase
    .from("articulos")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugExistente) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // 6. Insertar en borrador
  const modelo = process.env.OPENAI_MODEL_ARTICULOS ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const { data: articulo, error: insertError } = await supabase
    .from("articulos")
    .insert({
      tema_id: id,
      titulo: generado.titulo,
      slug,
      cuerpo: generado.cuerpo,
      tipo: tema.tipo,
      estado: "borrador",
      hash,
      modelo_usado: modelo,
      portada_url: generado.portada_url,
      portada_keywords: generado.portada_keywords,
      portada_credito: generado.portada_credito,
    })
    .select("id, titulo, slug, tipo, estado, portada_url")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, articulo });
}
