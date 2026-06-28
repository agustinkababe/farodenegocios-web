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

  const url = new URL(request.url);
  const estado = url.searchParams.get("estado"); // borrador | publicado | rechazado

  const supabase = createServerClient();
  let query = supabase
    .from("articulos")
    .select("id, tema_id, titulo, slug, tipo, estado, modelo_usado, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
