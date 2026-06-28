import { NextResponse } from "next/server";
import { autoPublicarArticulos } from "@/lib/autoPublicarArticulos";

export const maxDuration = 300;

function checkAuth(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

// Disparo manual del pipeline automático.
// Body opcional: { "limite": 5 } para sobreescribir ARTICULOS_POR_CORRIDA en esta corrida.
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const defaultLimite = Number(process.env.ARTICULOS_POR_CORRIDA ?? "3");

  let limite = defaultLimite;
  try {
    const body = (await request.json()) as { limite?: number };
    if (typeof body.limite === "number" && body.limite >= 1 && body.limite <= 20) {
      limite = body.limite;
    }
  } catch { /* body vacío está bien */ }

  const resultado = await autoPublicarArticulos(limite);

  console.log("[admin/auto-publicar]", resultado);

  return NextResponse.json({ ok: true, limite_usado: limite, ...resultado });
}
