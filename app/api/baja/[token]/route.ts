import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("encuestas")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null); // Idempotente: solo marca la primera vez

  if (error) {
    console.error("Error procesando baja:", error);
    return NextResponse.json({ error: "Error al procesar la baja" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
