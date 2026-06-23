import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// Redirect de tracking: registra el clic del contacto y lo lleva al informe.
// Todos los CTAs de mail apuntan acá en lugar de a /informe/[id] directamente.
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const destino = new URL(`/informe/${id}`, request.url);

  // Registrar el clic — fire and forget, no debe bloquear el redirect
  try {
    const supabase = createServerClient();
    await supabase
      .from("encuestas")
      .update({ clickeo_at: new Date().toISOString() })
      .eq("id", id)
      .is("clickeo_at", null); // Solo marca la primera vez
  } catch (e) {
    console.error("Error registrando clic:", e);
  }

  return NextResponse.redirect(destino);
}
