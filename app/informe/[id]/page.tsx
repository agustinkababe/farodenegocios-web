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

// Indicadores CUALITATIVOS del contexto macro PyME argentino.
// No contienen cifras inventadas — son caracterizaciones verdaderas y estables.
function IndicadoresMacro() {
  const señales = [
    {
      label: "Consumo minorista",
      valor: "En baja",
      sub: "PyME Argentina",
      up: false,
      ringColor: "ring-red-100",
      bg: "bg-red-50",
      textColor: "text-red-600",
      subColor: "text-red-400",
      arrowColor: "#dc2626",
    },
    {
      label: "Ventas digitales",
      valor: "En alza",
      sub: "Canal en crecimiento",
      up: true,
      ringColor: "ring-emerald-100",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
      subColor: "text-emerald-400",
      arrowColor: "#059669",
    },
    {
      label: "Tecnología a medida",
      valor: "Ahora accesible",
      sub: "Antes solo grandes empresas",
      up: true,
      ringColor: "ring-indigo-100",
      bg: "bg-indigo-50",
      textColor: "text-indigo-600",
      subColor: "text-indigo-400",
      arrowColor: "#4f46e5",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      {señales.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl ring-1 ${s.ringColor} ${s.bg} p-3.5 flex flex-col gap-1.5`}
        >
          <p className="text-xs text-slate-500 leading-tight font-medium">{s.label}</p>
          <div className="flex items-center gap-1">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="shrink-0"
            >
              {s.up ? (
                <path
                  d="M6.5 11V2M6.5 2L3 5.5M6.5 2L10 5.5"
                  stroke={s.arrowColor}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M6.5 2V11M6.5 11L3 7.5M6.5 11L10 7.5"
                  stroke={s.arrowColor}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span className={`text-xs font-bold ${s.textColor}`}>{s.valor}</span>
          </div>
          <p className={`text-xs ${s.subColor} leading-tight`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// Bloque de FOMO — totalmente cualitativo, sin estadísticas inventadas.
// Se oculta en impresión porque es una pieza de conversión, no de contenido.
function BloqueFOMO() {
  return (
    <div className="rounded-2xl bg-slate-800 text-white px-6 py-5 space-y-3 print:hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        El momento
      </p>
      <p className="text-sm leading-relaxed text-slate-200">
        Cada vez más comercios están encontrando que la tecnología puede
        encargarse de las partes repetitivas del negocio — no para reemplazar
        al dueño, sino para que su tiempo vaya a donde realmente importa.
      </p>
      <p className="text-sm leading-relaxed text-slate-200">
        Lo que cambió es el costo. Lo que antes requería meses de desarrollo y
        presupuesto de empresa grande, hoy se puede construir en semanas a una
        fracción del precio. Los que se dan cuenta de esto primero llevan
        ventaja — porque cuando el consumo rebote, van a estar mejor parados.
      </p>
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
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Header web — oculto en impresión */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 print:hidden">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Faro de Negocios
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M2 9v2.5h9V9M6.5 1v7M6.5 8L4 5.5M6.5 8L9 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Descargar PDF
          </button>
        </div>
      </header>

      {/* Cabecera solo para impresión */}
      <div className="hidden print:flex items-center justify-between px-0 pt-0 pb-5 border-b border-slate-200 mb-6">
        <span className="text-sm font-semibold text-slate-600">
          Faro de Negocios
        </span>
        <span className="text-xs text-slate-400">Diagnóstico PyME — Confidencial</span>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-7 print:px-0 print:py-0 print:space-y-6">
        {/* Título */}
        <h1 className="text-2xl font-bold text-slate-900 leading-snug">
          {informe.titulo}
        </h1>

        {/* Capa de contexto: indicadores cualitativos + texto del sector */}
        <section>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            Así está el rubro
          </p>
          <IndicadoresMacro />
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Cuerpo texto={informe.seccion_sector} />
          </div>
        </section>

        {/* Capa espejo: el negocio del usuario */}
        <section>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
            Tu negocio en este contexto
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Cuerpo texto={informe.seccion_espejo} />
          </div>
        </section>

        {/* Bloque FOMO — cuantitativo-cualitativo, sin cifras inventadas, oculto en PDF */}
        <BloqueFOMO />

        {/* Cierre: planta el deseo de la categoría (sin mención de fiable) */}
        <section>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
            Por dónde empezar
          </p>
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
            <Cuerpo texto={informe.seccion_cierre} />
          </div>
        </section>

        {/* CTA fiable — aparece en caliente, justo después del cierre, oculto en PDF */}
        <div className="rounded-2xl bg-indigo-700 px-6 py-5 text-white print:hidden">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
            Quién lo hace
          </p>
          <p className="font-semibold text-base leading-snug">
            fiable desarrolla exactamente ese tipo de solución para PyMEs.
          </p>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed">
            No el sistema enlatado que no te cierra ni el ERP que no podés
            pagar. Tecnología hecha para tu proceso puntual, a un costo que
            tiene sentido para un negocio como el tuyo.
          </p>
          <a
            href="https://fiable.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block bg-white text-indigo-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Contale tu caso a fiable
          </a>
        </div>

        {/* Footer web */}
        <p className="text-center text-xs text-slate-400 pb-4 print:hidden">
          Diagnóstico generado por Faro de Negocios.
        </p>

        {/* Footer de impresión */}
        <div className="hidden print:block text-center pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            Diagnóstico generado por Faro de Negocios · farodenegocios.com.ar
          </p>
        </div>
      </main>
    </div>
  );
}
