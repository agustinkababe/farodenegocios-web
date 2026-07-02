"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";

// ── Iconos ────────────────────────────────────────────────────────────────

const IconPaper = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconGear = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
);
const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
);
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
);
const IconBulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 21h6M10 17h4M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.19V17H9v-.81A7 7 0 0 1 12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
);
const IconTrend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
);
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8A16 16 0 0 0 14 14.73l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Arrow animada ─────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg
    width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
    className="transition-transform duration-200 ease-out group-hover:translate-x-[4px] shrink-0"
  >
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Pool de creatividades ─────────────────────────────────────────────────
//
// Cada creatividad tiene su propia foto de Unsplash (licencia libre, uso comercial OK).
// El overlay CSS oscuro garantiza legibilidad del texto sobre cualquier foto.
// Pool de 10 ítems: cubre hasta 10 slots por sesión sin repetir.

const UNSPLASH = "https://images.unsplash.com/photo-";
const IMG_PARAMS = "?w=600&q=72&fit=crop&auto=format";

type Creative = {
  headline: string;
  sub: string;
  cta: string;
  icon: ReactNode;
  img: string;
};

const POOL: Creative[] = [
  {
    headline: "¿Tu negocio todavía anota los pedidos en papel?",
    sub: "Hay una forma mejor de organizarte, sin software complicado.",
    cta: "Ver cómo",
    icon: <IconPaper />,
    img: `${UNSPLASH}1556742049-0cfed4f6a45d${IMG_PARAMS}`,
  },
  {
    headline: "Perdés ventas porque no llegás a responder a tiempo.",
    sub: "Se puede resolver sin contratar más gente.",
    cta: "Cómo funciona",
    icon: <IconClock />,
    img: `${UNSPLASH}1460925895917-afdab827c52f${IMG_PARAMS}`,
  },
  {
    headline: "El sistema a medida ya no es solo para grandes empresas.",
    sub: "Bajo costo, sin ERP, sin licencias anuales.",
    cta: "Ver opciones",
    icon: <IconGear />,
    img: `${UNSPLASH}1504868584819-f8e8b4b6d7e3${IMG_PARAMS}`,
  },
  {
    headline: "¿Cuántas horas por semana le perdés al Excel que siempre falla?",
    sub: "Hay alternativas simples hechas para la PyME.",
    cta: "Conocé más",
    icon: <IconGrid />,
    img: `${UNSPLASH}1551434678-e076c223a692${IMG_PARAMS}`,
  },
  {
    headline: "Control de stock, pedidos y consultas en un solo lugar.",
    sub: "Sin complejidad. Sin soporte eterno.",
    cta: "Ver cómo",
    icon: <IconBox />,
    img: `${UNSPLASH}1542744173-8e7e53415bb0${IMG_PARAMS}`,
  },
  {
    headline: "Tu negocio trabaja. El sistema debería trabajar para vos.",
    sub: "Automatizá lo repetitivo y dedicá tiempo a lo que importa.",
    cta: "Conocé más",
    icon: <IconBulb />,
    img: `${UNSPLASH}1497366216548-37526070297c${IMG_PARAMS}`,
  },
  {
    headline: "Menos horas administrativas, más horas de negocio.",
    sub: "Las PyMEs que ordenaron su operación crecen más rápido.",
    cta: "Cómo se hace",
    icon: <IconTrend />,
    img: `${UNSPLASH}1560472354-b33ff0c44a43${IMG_PARAMS}`,
  },
  {
    headline: "Cada consulta sin responder es una venta que no fue.",
    sub: "Automatizar no es caro. Es lo que permite escalar sin crecer en costos.",
    cta: "Ver soluciones",
    icon: <IconChat />,
    img: `${UNSPLASH}1507003211169-0a1dd7228f2d${IMG_PARAMS}`,
  },
  {
    headline: "¿Por qué seguir respondiendo de a una consulta a la vez?",
    sub: "Hay formas de ordenar la demanda sin perder el trato personalizado.",
    cta: "Ver opciones",
    icon: <IconPhone />,
    img: `${UNSPLASH}1516321318423-f06f85e504b3${IMG_PARAMS}`,
  },
  {
    headline: "Más velocidad, menos fricción, mismo equipo.",
    sub: "Un sistema pensado para tu operación hace la diferencia desde el día uno.",
    cta: "Conocé más",
    icon: <IconZap />,
    img: `${UNSPLASH}1521737852567-6949f3f9f2b5${IMG_PARAMS}`,
  },
];

// ── Pool manager — garantiza rotación sin repetir en la misma sesión ──────
//
// Al agotar el pool, baraja de nuevo antes de reiniciar.
// JS es single-threaded: los efectos de múltiples slots se ejecutan en orden,
// así que los incrementos son seguros sin lock.

let _pool: Creative[] = [];
let _cursor = 0;

function claimCreative(): Creative {
  if (_pool.length === 0 || _cursor >= _pool.length) {
    _pool = [...POOL].sort(() => Math.random() - 0.5);
    _cursor = 0;
  }
  return _pool[_cursor++];
}

// ── Overlay de imagen — oscuro para legibilidad del texto ─────────────────

const OVERLAY = "linear-gradient(160deg, rgba(8,20,36,0.90) 0%, rgba(12,34,54,0.78) 100%)";

function bgStyle(img: string): CSSProperties {
  return {
    backgroundImage: `${OVERLAY}, url('${img}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

// ── Tipos y constantes ────────────────────────────────────────────────────

export type AdFormat = "leaderboard" | "rectangle" | "in-article";
const UTM = "https://fiable.com.ar/?utm_source=farodenegocios&utm_medium=housead&utm_campaign=slot_";

// ── Componente ────────────────────────────────────────────────────────────

export function HouseAdContent({ format }: { format: AdFormat }) {
  const [creative, setCreative] = useState<Creative>(POOL[0]);
  const [mounted, setMounted] = useState(false);
  const claimed = useRef(false);

  useEffect(() => {
    // useRef evita doble-claim en React Strict Mode (dev)
    if (!claimed.current) {
      claimed.current = true;
      setCreative(claimCreative());
      setMounted(true);
    }
  }, []);

  const url = UTM + format;
  const fadeIn: CSSProperties = mounted
    ? { opacity: 1, transform: "translateY(0)", transition: "opacity 0.45s ease, transform 0.45s ease" }
    : { opacity: 0, transform: "translateY(6px)" };

  // ── Rectangle (sidebar / below-grid) ─────────────────────────────────────
  if (format === "rectangle") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group relative flex flex-col w-full overflow-hidden rounded-[8px] no-underline border border-white/10 hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        aria-label={`Publicidad: ${creative.headline}`}
        style={{ ...bgStyle(creative.img), ...fadeIn, minHeight: 252 }}
      >
        {/* Barra accent superior */}
        <div className="h-[5px] bg-gradient-to-r from-[#b06818] via-[#C7872A] to-[#e8a840] shrink-0" />

        <div className="flex flex-col gap-3 p-5 flex-1">
          {/* Label + icono */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-sans text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5">
              Publicidad
            </span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white/70 shrink-0">
              {creative.icon}
            </span>
          </div>

          {/* Headline */}
          <p className="font-sans text-[15px] font-bold text-white leading-snug flex-1" style={{ lineHeight: 1.35 }}>
            {creative.headline}
          </p>

          {/* Sub */}
          <p className="font-sans text-[11.5px] text-white/65 leading-relaxed">
            {creative.sub}
          </p>

          {/* CTA — con pulse configurable vía .house-ad-cta */}
          <span className="house-ad-cta mt-1 flex items-center justify-center gap-1.5 w-full font-sans text-[13px] font-bold text-[#0C2236] bg-[#C7872A] group-hover:bg-[#d99535] px-4 py-2.5 rounded-[5px] transition-colors duration-200">
            {creative.cta}
            <ArrowRight />
          </span>
        </div>
      </a>
    );
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────
  if (format === "leaderboard") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group relative flex items-center gap-4 px-5 py-4 rounded-[8px] overflow-hidden border border-white/10 hover:border-white/20 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] no-underline"
        aria-label={`Publicidad: ${creative.headline}`}
        style={{ ...bgStyle(creative.img), ...fadeIn }}
      >
        {/* Línea accent izquierda */}
        <div className="relative shrink-0 w-[4px] self-stretch rounded-full bg-gradient-to-b from-[#C7872A] to-[#e8a840]" />

        <div className="relative flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="font-sans text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
            Publicidad
          </span>
          <span className="font-sans text-[14px] font-bold text-white leading-snug">
            {creative.headline}
          </span>
          <span className="font-sans text-[12px] text-white/60 leading-relaxed hidden sm:block">
            {creative.sub}
          </span>
        </div>

        {/* CTA — con pulse configurable */}
        <span className="house-ad-cta relative flex items-center gap-1.5 font-sans text-[12px] font-bold text-[#0C2236] bg-[#C7872A] group-hover:bg-[#d99535] whitespace-nowrap shrink-0 px-3.5 py-2 rounded-[5px] transition-colors duration-150">
          {creative.cta}
          <ArrowRight />
        </span>
      </a>
    );
  }

  // ── In-article ────────────────────────────────────────────────────────────
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-[8px] overflow-hidden border border-white/10 hover:border-white/20 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] no-underline"
      aria-label={`Publicidad: ${creative.headline}`}
      style={{ ...bgStyle(creative.img), ...fadeIn }}
    >
      {/* Icono */}
      <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white/70 shrink-0 self-start sm:self-center">
        {creative.icon}
      </span>

      <div className="relative flex flex-col gap-1 flex-1 min-w-0">
        <span className="font-sans text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
          Publicidad
        </span>
        <span className="font-sans text-[14px] font-bold text-white leading-snug">
          {creative.headline}
        </span>
        <span className="font-sans text-[12px] text-white/60 leading-relaxed">
          {creative.sub}
        </span>
      </div>

      {/* CTA — con pulse configurable */}
      <span className="house-ad-cta relative flex items-center gap-1.5 font-sans text-[12px] font-bold text-[#0C2236] bg-[#C7872A] group-hover:bg-[#d99535] whitespace-nowrap shrink-0 self-start sm:self-center px-3.5 py-2 rounded-[5px] transition-colors duration-150">
        {creative.cta}
        <ArrowRight />
      </span>
    </a>
  );
}
