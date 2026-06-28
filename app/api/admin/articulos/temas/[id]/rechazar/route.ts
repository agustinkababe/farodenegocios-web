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

  const { error } = await supabase
    .from("articulos_temas")
    .update({ estado: "rechazado" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
