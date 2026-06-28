import { NextResponse } from "next/server";
import { autoPublicarArticulos } from "@/lib/autoPublicarArticulos";

// Tiempo máximo generoso: cada artículo puede tardar ~30s (IA + Unsplash)
export const maxDuration = 300;

function checkCronAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return !!secret && auth === `Bearer ${secret}`;
}

// Cron: lunes, miércoles y viernes a las 08:00 UTC (configurado en vercel.json)
export async function GET(request: Request) {
  if (!checkCronAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const limite = Number(process.env.ARTICULOS_POR_CORRIDA ?? "3");
  if (!Number.isFinite(limite) || limite < 1 || limite > 20) {
    return NextResponse.json(
      { error: "ARTICULOS_POR_CORRIDA debe ser un número entre 1 y 20" },
      { status: 400 }
    );
  }

  const resultado = await autoPublicarArticulos(limite);

  console.log("[cron/publicar-articulos]", resultado);

  return NextResponse.json({ ok: true, ...resultado });
}
