import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { enviarMailSeguimiento1, enviarMailSeguimiento2 } from "@/lib/email";

// Umbrales de la cadencia (relativo al envío del informe):
//   Seguimiento 1: 3 días después
//   Seguimiento 2: 7 días después
// Modo test (?test=1, solo en development): 1 min y 2 min

function umbrales(esTest: boolean): { seg1: string; seg2: string } {
  const ahora = Date.now();
  const seg1 = new Date(
    ahora - (esTest ? 1 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000)
  ).toISOString();
  const seg2 = new Date(
    ahora - (esTest ? 2 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000)
  ).toISOString();
  return { seg1, seg2 };
}

export async function GET(request: Request) {
  // Vercel envía Authorization: Bearer <CRON_SECRET> en cada disparo de cron.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const esTest =
    url.searchParams.get("test") === "1" &&
    process.env.NODE_ENV !== "production";

  const { seg1: cutoff1, seg2: cutoff2 } = umbrales(esTest);
  const supabase = createServerClient();
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const stats = { seg1Enviados: 0, seg2Enviados: 0, errores: 0 };

  // ── SEGUIMIENTO 1 ────────────────────────────────────────────────────────────
  // Condiciones: informe enviado hace > 3d, seg1 no enviado, no dado de baja.
  // Nota: clic al informe (clickeo_at) no frena seg1 — solo frena clic a fiable (clic_fiable_at).

  const { data: candidatos1 } = await supabase
    .from("encuestas")
    .select("id, email, rubro, tarea_repetitiva, unsubscribe_token")
    .not("enviado_informe_at", "is", null)
    .lt("enviado_informe_at", cutoff1)
    .is("enviado_seguimiento1_at", null)
    .is("unsubscribed_at", null);

  for (const c of candidatos1 ?? []) {
    if (!c.unsubscribe_token) continue;

    const { data: informe } = await supabase
      .from("informes")
      .select("titulo")
      .eq("encuesta_id", c.id)
      .maybeSingle();

    if (!informe) continue;

    try {
      await enviarMailSeguimiento1({
        email: c.email,
        rubro: c.rubro,
        tarea_repetitiva: c.tarea_repetitiva,
        titulo: informe.titulo,
        fiableUrl: `${siteUrl}/f/${c.id}`,
        informeUrl: `${siteUrl}/r/${c.id}`,
        unsubscribeUrl: `${siteUrl}/baja/${c.unsubscribe_token}`,
      });

      await supabase
        .from("encuestas")
        .update({ enviado_seguimiento1_at: new Date().toISOString() })
        .eq("id", c.id);

      stats.seg1Enviados++;
    } catch (e) {
      console.error(`[cadencia] Error seg1 → ${c.email}:`, e);
      stats.errores++;
    }
  }

  // ── SEGUIMIENTO 2 ────────────────────────────────────────────────────────────
  // Condiciones: informe enviado hace > 7d, seg1 enviado, seg2 no enviado,
  //              no dado de baja, NO hizo clic en link de fiable.

  const { data: candidatos2 } = await supabase
    .from("encuestas")
    .select("id, email, rubro, tarea_repetitiva, unsubscribe_token")
    .not("enviado_informe_at", "is", null)
    .lt("enviado_informe_at", cutoff2)
    .not("enviado_seguimiento1_at", "is", null)
    .is("enviado_seguimiento2_at", null)
    .is("unsubscribed_at", null)
    .is("clic_fiable_at", null);

  for (const c of candidatos2 ?? []) {
    if (!c.unsubscribe_token) continue;

    const { data: informe } = await supabase
      .from("informes")
      .select("titulo")
      .eq("encuesta_id", c.id)
      .maybeSingle();

    if (!informe) continue;

    try {
      await enviarMailSeguimiento2({
        email: c.email,
        rubro: c.rubro,
        tarea_repetitiva: c.tarea_repetitiva,
        titulo: informe.titulo,
        fiableUrl: `${siteUrl}/f/${c.id}`,
        informeUrl: `${siteUrl}/r/${c.id}`,
        unsubscribeUrl: `${siteUrl}/baja/${c.unsubscribe_token}`,
      });

      await supabase
        .from("encuestas")
        .update({ enviado_seguimiento2_at: new Date().toISOString() })
        .eq("id", c.id);

      stats.seg2Enviados++;
    } catch (e) {
      console.error(`[cadencia] Error seg2 → ${c.email}:`, e);
      stats.errores++;
    }
  }

  console.log("[cadencia]", { ...stats, esTest, cutoff1, cutoff2 });
  return NextResponse.json({ ok: true, ...stats, esTest });
}
