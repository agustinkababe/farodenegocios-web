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
