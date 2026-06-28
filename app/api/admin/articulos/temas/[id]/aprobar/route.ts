import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

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

  // Permite editar el título al aprobar (body opcional con { titulo })
  let tituloEditado: string | undefined;
  try {
    const body = await request.json() as { titulo?: string };
    if (typeof body.titulo === "string" && body.titulo.trim()) {
      tituloEditado = body.titulo.trim();
    }
  } catch { /* body vacío está bien */ }

  const updates: Record<string, string> = { estado: "aprobado" };
  if (tituloEditado) updates.titulo = tituloEditado;

  const { error } = await supabase
    .from("articulos_temas")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
