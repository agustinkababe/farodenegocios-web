import { NextRequest, NextResponse } from "next/server";
import {
  enviarMailInforme,
  enviarMailSeguimiento1,
  enviarMailSeguimiento2,
} from "@/lib/email";

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-admin-secret") === secret;
}

// POST /api/admin/test-mails
// Body: { "to": "email@ejemplo.com" }  (opcional — si no, usa ADMIN_TEST_EMAIL o EMAIL_FROM)
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const to: string =
    body.to ??
    process.env.ADMIN_TEST_EMAIL ??
    process.env.EMAIL_FROM ??
    "test@example.com";

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const datosInforme = {
    email: to,
    rubro: "Ferretería",
    titulo: "Tu negocio y el contexto ferretero",
    seccion_espejo:
      "Manejás entre 30 y 50 consultas por día y lo de 'responder pedidos por WhatsApp' te consume cerca de 10 horas semanales — casi dos días de trabajo por semana en algo que no genera ventas directas.",
    informeUrl: `${siteUrl}/r/TEST-ID`,
    unsubscribeUrl: `${siteUrl}/baja/TEST-TOKEN`,
  };

  const datosSeguimiento = {
    email: to,
    rubro: "Ferretería",
    tarea_repetitiva: "responder pedidos por WhatsApp",
    titulo: "Tu negocio y el contexto ferretero",
    fiableUrl: `${siteUrl}/f/TEST-ID`,
    informeUrl: `${siteUrl}/r/TEST-ID`,
    unsubscribeUrl: `${siteUrl}/baja/TEST-TOKEN`,
  };

  const resultados: { mail: string; ok: boolean; error?: string }[] = [];

  for (const [nombre, fn] of [
    ["inmediato", () => enviarMailInforme(datosInforme)],
    ["seguimiento1", () => enviarMailSeguimiento1(datosSeguimiento)],
    ["seguimiento2", () => enviarMailSeguimiento2(datosSeguimiento)],
  ] as const) {
    try {
      await fn();
      resultados.push({ mail: nombre, ok: true });
    } catch (err) {
      resultados.push({ mail: nombre, ok: false, error: String(err) });
    }
  }

  return NextResponse.json({ to, resultados });
}
