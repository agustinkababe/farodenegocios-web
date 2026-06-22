"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Informe = {
  titulo: string;
  seccion_sector: string;
  seccion_espejo: string;
  seccion_cierre: string;
  rubro_clasificado?: string;
};

type Estado =
  | { fase: "cargando" }
  | { fase: "listo"; informe: Informe }
  | { fase: "error"; mensaje: string };

// Divide el texto en párrafos por líneas en blanco y descarta encabezados
// que el modelo pudiera haber colado (líneas que terminan en ":" o empiezan con "#").
function Cuerpo({ texto, className }: { texto: string; className?: string }) {
  const parrafos = texto
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.match(/^#+\s/) && !p.match(/^.{0,60}:$/));

  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      {parrafos.map((p, i) => (
        <p key={i} className="text-slate-700 text-sm leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function InformePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [estado, setEstado] = useState<Estado>({ fase: "cargando" });

  useEffect(() => {
    if (!id) {
      setEstado({ fase: "error", mensaje: "ID de informe no encontrado." });
      return;
    }

    fetch(`/api/informe/${id}`)
      .then((res) => res.json())
      .then((data: { ok?: boolean; informe?: Informe; error?: string }) => {
        if (data.ok && data.informe) {
          setEstado({ fase: "listo", informe: data.informe });
        } else {
          setEstado({
            fase: "error",
            mensaje: data.error ?? "No pudimos generar tu informe.",
          });
        }
      })
      .catch(() => {
        setEstado({
          fase: "error",
          mensaje: "Hubo un problema de conexión. Intentá recargar la página.",
        });
      });
  }, [id]);

  if (estado.fase === "cargando") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-5" />
          <h1 className="text-lg font-semibold text-slate-800">
            Estamos armando tu diagnóstico
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Cruzamos tus respuestas con datos reales de tu rubro. Puede tardar
            unos segundos.
          </p>
        </div>
      </div>
    );
  }

  if (estado.fase === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="text-slate-600 text-sm leading-relaxed">
            {estado.mensaje}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const { informe } = estado;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-slate-700">
            Faro de Negocios
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-slate-900 leading-snug">
          {informe.titulo}
        </h1>

        {/* Capa de contexto: datos reales del sector */}
        <section>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            Así está el rubro
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Cuerpo texto={informe.seccion_sector} />
          </div>
        </section>

        {/* Capa de espejo: el negocio del usuario, en sus palabras */}
        <section>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            Tu negocio en este contexto
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Cuerpo texto={informe.seccion_espejo} />
          </div>
        </section>

        {/* Cierre: anclado en el dolor del usuario + fiable */}
        <section>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
            Por dónde empezar
          </p>
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
            <Cuerpo texto={informe.seccion_cierre} />
          </div>
        </section>

        {/* CTA hacia fiable */}
        <div className="bg-indigo-700 rounded-2xl p-6 text-white text-center">
          <p className="font-semibold text-base">
            ¿Querés ver cómo se resolvería en tu negocio?
          </p>
          <p className="mt-1.5 text-indigo-200 text-sm">
            fiable trabaja con PyMEs como la tuya. Sin compromisos, sin
            burocracia.
          </p>
          <a
            href="https://fiable.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-white text-indigo-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Hablar con fiable
          </a>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          Diagnóstico generado por Faro de Negocios con datos de{" "}
          <span className="font-medium">CAME</span>.
        </p>
      </main>
    </div>
  );
}
