"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

type Estado = "inicial" | "cargando" | "listo" | "error";

export default function BajaPage() {
  const params = useParams();
  const token = params?.token as string | undefined;
  const [estado, setEstado] = useState<Estado>("inicial");

  async function confirmarBaja() {
    if (!token) return;
    setEstado("cargando");
    try {
      const res = await fetch(`/api/baja/${token}`, { method: "POST" });
      setEstado(res.ok ? "listo" : "error");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Faro de Negocios
        </p>

        {estado === "inicial" && (
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-3">
              Darse de baja
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Vas a dejar de recibir los mails de Faro de Negocios.
              Si en algún momento querés volver, el diagnóstico gratuito
              sigue disponible.
            </p>
            <button
              onClick={confirmarBaja}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl py-3 text-sm transition-colors"
            >
              Confirmar baja
            </button>
            <a
              href="/"
              className="block mt-3 text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              No, mejor quiero seguir recibiendo
            </a>
          </div>
        )}

        {estado === "cargando" && (
          <p className="text-sm text-slate-500">Procesando...</p>
        )}

        {estado === "listo" && (
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-3">
              Listo, te dimos de baja.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              No vas a recibir más mails nuestros. Si algún día querés un
              nuevo diagnóstico, el formulario sigue ahí.
            </p>
          </div>
        )}

        {estado === "error" && (
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-3">
              Algo no salió bien.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              No pudimos procesar la baja. Podés intentar de nuevo o
              escribirnos directamente.
            </p>
            <button
              onClick={confirmarBaja}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
