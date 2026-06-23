import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// Tracking de clic a fiable: registra clic_fiable_at y redirige a fiable.com.ar.
// Los CTAs de fiable en los mails de seguimiento apuntan acá.
// Registrar este clic es lo que frena la cadencia (no el clic al informe).
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const supabase = createServerClient();
    await supabase
      .from("encuestas")
      .update({ clic_fiable_at: new Date().toISOString() })
      .eq("id", id)
      .is("clic_fiable_at", null); // Solo marca la primera vez
  } catch (e) {
    console.error("Error registrando clic a fiable:", e);
  }

  return NextResponse.redirect(new URL("https://fiable.com.ar", request.url));
}
