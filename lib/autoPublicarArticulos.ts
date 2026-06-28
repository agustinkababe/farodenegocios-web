import { createServerClient } from "./supabase-server";
import { proponerTemas, hashTitulo, generarSlug, generarArticulo } from "./generarArticulo";

const MODELO =
  process.env.OPENAI_MODEL_ARTICULOS ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type TemaDisponible = {
  id: string;
  titulo: string;
  tipo: "educativo" | "coyuntura" | "como-hacer" | "casos";
};

// Temas aprobados (cualquier tipo) que aún no tienen artículo generado
async function getTemasDisponibles(
  supabase: ReturnType<typeof createServerClient>
): Promise<TemaDisponible[]> {
  const { data: aprobados } = await supabase
    .from("articulos_temas")
    .select("id, titulo, tipo")
    .eq("estado", "aprobado");

  if (!aprobados || aprobados.length === 0) return [];

  const { data: conArticulo } = await supabase
    .from("articulos")
    .select("tema_id")
    .not("tema_id", "is", null);

  const usados = new Set((conArticulo ?? []).map((a) => a.tema_id as string));
  return (aprobados as TemaDisponible[]).filter((t) => !usados.has(t.id));
}

// Genera un lote de temas nuevos. Todos los tipos → auto-aprobados (coyuntura se genera en modo cualitativo).
async function topUpTemas(
  supabase: ReturnType<typeof createServerClient>
): Promise<TemaDisponible[]> {
  let propuestas;
  try {
    propuestas = await proponerTemas();
  } catch {
    return [];
  }

  const hashes = propuestas.map((t) => hashTitulo(t.titulo));
  const { data: existentes } = await supabase
    .from("articulos_temas")
    .select("hash")
    .in("hash", hashes);

  const hashesExistentes = new Set((existentes ?? []).map((r) => r.hash as string));
  const nuevos = propuestas
    .map((t) => ({ ...t, hash: hashTitulo(t.titulo) }))
    .filter((t) => !hashesExistentes.has(t.hash));

  if (nuevos.length === 0) return [];

  const { data: insertados } = await supabase
    .from("articulos_temas")
    .insert(
      nuevos.map((t) => ({
        titulo: t.titulo,
        tipo: t.tipo,
        estado: "aprobado",
        hash: t.hash,
      }))
    )
    .select("id, titulo, tipo");

  return (insertados ?? []) as TemaDisponible[];
}

export type AutoPublicarResult = {
  publicados: number;
  temas_nuevos: number;
  saltados: number;
  errores: string[];
};

export async function autoPublicarArticulos(
  limite: number
): Promise<AutoPublicarResult> {
  const supabase = createServerClient();
  let publicados = 0;
  let temasNuevos = 0;
  let saltados = 0;
  const errores: string[] = [];

  // 1. Temas educativos aprobados sin artículo
  let temas = await getTemasDisponibles(supabase);

  // 2. Si no hay suficientes, generar un lote nuevo
  if (temas.length < limite) {
    const nuevos = await topUpTemas(supabase);
    temasNuevos = nuevos.length;
    temas = [...temas, ...nuevos];
  }

  // 3. Tope estricto: nunca superar el límite
  const aGenerar = temas.slice(0, limite);

  // 4. Generar y publicar uno por uno
  for (const tema of aGenerar) {
    try {
      // Baranda 1: ya existe artículo para este tema
      const { data: existente } = await supabase
        .from("articulos")
        .select("id")
        .eq("tema_id", tema.id)
        .maybeSingle();

      if (existente) {
        saltados++;
        continue;
      }

      const generado = await generarArticulo({ titulo: tema.titulo, tipo: tema.tipo }, "auto");

      // Baranda 2: hash de contenido duplicado
      const hash = hashTitulo(generado.titulo);
      const { data: hashExistente } = await supabase
        .from("articulos")
        .select("id")
        .eq("hash", hash)
        .maybeSingle();

      if (hashExistente) {
        saltados++;
        continue;
      }

      // Baranda 3: slug único
      let slug = generarSlug(generado.titulo);
      const { data: slugExistente } = await supabase
        .from("articulos")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (slugExistente) slug = `${slug}-${Date.now().toString(36)}`;

      // Publicar directamente (sin pasar por borrador)
      const { error: insertError } = await supabase.from("articulos").insert({
        tema_id: tema.id,
        titulo: generado.titulo,
        slug,
        cuerpo: generado.cuerpo,
        tipo: tema.tipo,
        estado: "publicado",
        hash,
        modelo_usado: MODELO,
        portada_url: generado.portada_url,
        portada_keywords: generado.portada_keywords,
        portada_credito: generado.portada_credito,
      });

      if (insertError) throw new Error(insertError.message);
      publicados++;
    } catch (e) {
      errores.push(
        `[${tema.titulo}]: ${e instanceof Error ? e.message : "error desconocido"}`
      );
    }
  }

  return { publicados, temas_nuevos: temasNuevos, saltados, errores };
}
