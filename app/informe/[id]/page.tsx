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

// Renderiza párrafos del texto del informe (filtra encabezados markdown y labels cortos).
function Cuerpo({ texto, className }: { texto: string; className?: string }) {
  const parrafos = texto
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 0 &&
        !p.match(/^#+\s/) &&
        !p.match(/^.{0,60}:$/)
    );

  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      {parrafos.map((p, i) => (
        <p key={i} className="font-sans text-warm text-[15px] leading-[1.75]">
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
      label:      "Consumo minorista",
      valor:      "En baja",
      sub:        "PyME Argentina",
      up:         false,
      ringColor:  "ring-red-200/60",
      bg:         "bg-red-50",
      textColor:  "text-red-700",
      subColor:   "text-red-400",
      arrowColor: "#b91c1c",
    },
    {
      label:      "Ventas digitales",
      valor:      "En alza",
      sub:        "Canal en crecimiento",
      up:         true,
      ringColor:  "ring-emerald-200/60",
      bg:         "bg-emerald-50",
      textColor:  "text-emerald-700",
      subColor:   "text-emerald-500",
      arrowColor: "#059669",
    },
    {
      label:      "Tecnología a medida",
      valor:      "Ahora accesible",
      sub:        "Antes solo grandes empresas",
      up:         true,
      ringColor:  "ring-navy-500/20",
      bg:         "bg-navy-500/5",
      textColor:  "text-navy-700",
      subColor:   "text-navy-500/70",
      arrowColor: "#356089",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      {señales.map((s) => (
        <div
          key={s.label}
          className={`rounded-[6px] ring-1 ${s.ringColor} ${s.bg} p-3.5 flex flex-col gap-1.5`}
        >
          <p className="text-xs text-muted leading-tight font-sans font-medium">
            {s.label}
          </p>
          <div className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
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
            <span className={`font-sans text-xs font-bold ${s.textColor}`}>
              {s.valor}
            </span>
          </div>
          <p className={`font-sans text-xs ${s.subColor} leading-tight`}>
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

// Bloque de FOMO — cualitativo, sin estadísticas inventadas.
// Oculto en impresión (es pieza de conversión, no de contenido).
function BloqueFOMO() {
  return (
    <div className="rounded-[6px] bg-ink text-white px-6 py-5 space-y-3 print:hidden">
      <p className="font-sans text-xs font-semibold text-white/40 uppercase tracking-wider">
        El momento
      </p>
      <p className="font-sans text-sm leading-relaxed text-white/75">
        Cada vez más comercios están encontrando que la tecnología puede
        encargarse de las partes repetitivas del negocio — no para reemplazar
        al dueño, sino para que su tiempo vaya a donde realmente importa.
      </p>
      <p className="font-sans text-sm leading-relaxed text-white/75">
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
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-10 h-10 border-4 border-line border-t-accent rounded-full animate-spin mx-auto mb-5" />
          <h1 className="font-display text-lg font-semibold text-ink">
            Estamos armando tu diagnóstico
          </h1>
          <p className="mt-2 font-sans text-sm text-muted leading-relaxed">
            Cruzamos tus respuestas con datos reales de tu rubro. Puede tardar
            unos segundos.
          </p>
        </div>
      </div>
    );
  }

  if (estado.fase === "error") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <p className="font-sans text-warm text-sm leading-relaxed">
            {estado.mensaje}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 font-sans text-sm text-navy-500 hover:text-ink underline transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const { informe } = estado;

  return (
    <div className="min-h-screen bg-bg print:bg-white font-sans">

      {/* ── Header web — oculto en impresión ── */}
      <header className="bg-surface border-b border-line px-4 py-[14px] print:hidden">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img
            src="/logo/faro-lockup-horizontal.svg"
            alt="Faro de Negocios"
            height={36}
            style={{ height: 36, width: "auto" }}
          />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-line hover:border-ink/30 rounded-[4px] px-3 py-1.5 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
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

      {/* ── Cabecera de impresión ── */}
      <div className="hidden print:flex items-center justify-between px-0 pt-0 pb-5 border-b border-line mb-6">
        <img
          src="/logo/faro-lockup-horizontal.svg"
          alt="Faro de Negocios"
          height={22}
          style={{ height: 22, width: "auto" }}
        />
        <span className="font-sans text-xs text-muted">
          Diagnóstico PyME — Confidencial
        </span>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-7 print:px-0 print:py-0 print:space-y-6">

        {/* Título */}
        <h1 className="font-display text-2xl font-semibold text-ink leading-snug">
          {informe.titulo}
        </h1>

        {/* Capa de contexto: indicadores cualitativos + texto del sector */}
        <section>
          <p className="font-sans text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">
            Así está el rubro
          </p>
          <IndicadoresMacro />
          <div className="bg-surface rounded-[6px] border border-line p-6">
            <Cuerpo texto={informe.seccion_sector} />
          </div>
        </section>

        {/* Capa espejo: el negocio del usuario */}
        <section>
          <p className="font-sans text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">
            Tu negocio en este contexto
          </p>
          <div className="bg-surface rounded-[6px] border border-line p-6">
            <Cuerpo texto={informe.seccion_espejo} />
          </div>
        </section>

        {/* Bloque FOMO — cualitativo, oculto en PDF */}
        <BloqueFOMO />

        {/* Cierre: planta el deseo de la categoría (texto agnóstico de fiable) */}
        <section>
          <p className="font-sans text-xs font-semibold text-accent-600 uppercase tracking-wider mb-3">
            Por dónde empezar
          </p>
          <div className="bg-surface rounded-[6px] border border-accent/20 p-6">
            <Cuerpo texto={informe.seccion_cierre} />
          </div>
        </section>

        {/* CTA fiable — en caliente, justo después del cierre, oculto en PDF */}
        <a
          href={`https://fiable.com.ar/?utm_source=farodenegocios&utm_medium=informe&utm_campaign=cta_informe`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block rounded-[10px] overflow-hidden no-underline border border-[#16A34A]/25 hover:border-[#16A34A]/55 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_32px_rgba(22,163,74,0.18)] print:hidden"
          style={{ background: "#0F1F1A" }}
        >
          {/* Barra verde superior */}
          <div className="h-[4px] bg-gradient-to-r from-[#047857] via-[#16A34A] to-[#39D98A]" />

          <div className="px-6 py-6 flex flex-col gap-4" style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
            {/* Logo fiable */}
            <div className="flex items-center gap-2">
              <img
                src="/fiable/logo-fiable-white.svg"
                alt=""
                aria-hidden="true"
                style={{ height: 32, width: "auto" }}
              />
              <span style={{ fontSize: 21, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px", lineHeight: 1 }}>
                fiable
              </span>
            </div>

            {/* Tagline + copy */}
            <div className="flex flex-col gap-2">
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
                Software a medida para Pymes
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                No el sistema enlatado que no te cierra ni el ERP que no podés pagar.
                Tecnología hecha para tu proceso puntual, a un costo que tiene sentido
                para un negocio como el tuyo.
              </p>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {["Primera consulta gratis", "Respuesta en menos de 24hs", "Sin compromiso"].map((t) => (
                <span key={t} className="flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600, color: "#39D98A" }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <circle cx="6" cy="6" r="5.5" stroke="#39D98A" strokeWidth="1"/>
                    <path d="M3.5 6l1.8 1.8 3-3" stroke="#39D98A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <span
              className="group-hover:bg-[#047857] inline-flex items-center gap-2 self-start text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors duration-200"
              style={{ background: "#16A34A", fontSize: 14, fontWeight: 700 }}
            >
              Contale tu caso a fiable
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-[3px]">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </a>

        {/* Footer web */}
        <p className="font-sans text-center text-xs text-muted pb-4 print:hidden">
          Diagnóstico generado por Faro de Negocios.
        </p>

        {/* Footer de impresión */}
        <div className="hidden print:block text-center pt-6 border-t border-line">
          <p className="font-sans text-xs text-muted">
            Diagnóstico generado por Faro de Negocios · farodenegocios.com.ar
          </p>
        </div>

      </main>
    </div>
  );
}
