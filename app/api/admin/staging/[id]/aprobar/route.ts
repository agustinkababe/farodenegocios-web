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

  // El body contiene los valores del dato (posiblemente corregidos por el admin)
  const body = await request.json();
  const {
    rubro_encuesta,
    rubro_display,
    mes_referencia,
    variacion_interanual,
    variacion_acumulada_anio,
    nota_cualitativa,
    fuente,
  } = body as {
    rubro_encuesta: string;
    rubro_display: string;
    mes_referencia: string;
    variacion_interanual: number | null;
    variacion_acumulada_anio: number | null;
    nota_cualitativa: string | null;
    fuente: string;
  };

  if (!rubro_encuesta || !rubro_display || !mes_referencia) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: rubro_encuesta, rubro_display, mes_referencia" },
      { status: 400 }
    );
  }

  // Upsert a producción — unicidad por (rubro_encuesta, mes_referencia)
  // Si ya existe ese rubro para ese mes, actualiza; si no, inserta.
  const { error: upsertError } = await supabase.from("datos_sector").upsert(
    {
      rubro_encuesta,
      rubro_display,
      mes_referencia,
      variacion_interanual: variacion_interanual ?? null,
      variacion_acumulada_anio: variacion_acumulada_anio ?? null,
      nota_cualitativa: nota_cualitativa ?? null,
      fuente: fuente || "CAME",
      fecha_actualizacion: new Date().toISOString(),
    },
    { onConflict: "rubro_encuesta,mes_referencia" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Marcar el registro de staging como aprobado
  const { error: updateError } = await supabase
    .from("datos_sector_staging")
    .update({ estado: "aprobado" })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
