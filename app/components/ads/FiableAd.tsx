"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ── Paleta de fiable ──────────────────────────────────────────────────────
// Verde primario: #16A34A · Verde claro: #39D98A · Verde oscuro (hover): #047857
// Fondo oscuro: #0F1F1A · Texto principal: #FFFFFF · Secundario: rgba(255,255,255,0.60)

// ── Pool de creatividades ─────────────────────────────────────────────────
// Mensajes textuales de fiable — NO inventados.

type FiableCreative = {
  tagline: string;
  copy: string;
  trust: string;
  cta: string;
};

const POOL: FiableCreative[] = [
  {
    tagline: "Software a medida para Pymes",
    copy: "Soluciones en días, no en meses. Tu problema puntual, sin vender lo que no necesitás.",
    trust: "Primera consulta gratis · Sin compromiso",
    cta: "Hablá con fiable",
  },
  {
    tagline: "Soluciones que de verdad funcionan",
    copy: "Años desarrollando para grandes empresas. Hoy, con IA, hacemos en días lo que antes llevaba meses.",
    trust: "Respuesta en menos de 24hs",
    cta: "Consulta gratis →",
  },
  {
    tagline: "Precios que tienen sentido para una Pyme",
    copy: "Accesible. Rápido. Enfocado. Sin costos inflados ni licencias que no usás.",
    trust: "Primera consulta gratis · Sin compromiso",
    cta: "Conocé fiable →",
  },
  {
    tagline: "Tu problema puntual, sin vender lo que no necesitás",
    copy: "No somos un ERP ni una plataforma genérica. Somos el equipo que resuelve tu caso.",
    trust: "Respuesta en menos de 24hs · Sin compromiso",
    cta: "Hablar con un asesor",
  },
  {
    tagline: "El tech de las grandes empresas, al alcance de tu Pyme",
    copy: "Con IA podemos hacer en días lo que antes llevaba meses — al precio que tiene sentido para vos.",
    trust: "Primera consulta gratis",
    cta: "Ver cómo →",
  },
];

// ── Pool manager — rotación sin repetir en la misma sesión ───────────────

let _pool: FiableCreative[] = [];
let _cursor = 0;

function claimCreative(): FiableCreative {
  if (_pool.length === 0 || _cursor >= _pool.length) {
    _pool = [...POOL].sort(() => Math.random() - 0.5);
    _cursor = 0;
  }
  return _pool[_cursor++];
}

// ── UTM ───────────────────────────────────────────────────────────────────

const URL_FIABLE = "https://fiable.com.ar/?utm_source=farodenegocios&utm_medium=brandad";

// ── Tipos ─────────────────────────────────────────────────────────────────

export type FiableAdFormat = "in-article" | "end-article" | "sidebar";

// ── Componente ────────────────────────────────────────────────────────────

export function FiableAd({ format }: { format: FiableAdFormat }) {
  const [creative, setCreative] = useState<FiableCreative>(POOL[0]);
  const [mounted, setMounted] = useState(false);
  const claimed = useRef(false);

  useEffect(() => {
    if (!claimed.current) {
      claimed.current = true;
      setCreative(claimCreative());
      setMounted(true);
    }
  }, []);

  const fadeIn = mounted
    ? { opacity: 1, transform: "translateY(0)", transition: "opacity 0.45s ease, transform 0.45s ease" }
    : { opacity: 0, transform: "translateY(6px)" };

  // ── Sidebar (300×~280px) ──────────────────────────────────────────────────
  if (format === "sidebar") {
    return (
      <a
        href={URL_FIABLE}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex flex-col w-full rounded-[10px] overflow-hidden no-underline border border-[#16A34A]/25 hover:border-[#16A34A]/50 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_6px_28px_rgba(22,163,74,0.18)]"
        aria-label={`Aviso de fiable: ${creative.tagline}`}
        style={{ background: "#0F1F1A", ...fadeIn }}
      >
        {/* Barra superior verde */}
        <div className="h-[4px] bg-gradient-to-r from-[#047857] via-[#16A34A] to-[#39D98A] shrink-0" />

        <div className="flex flex-col gap-4 p-5" style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/fiable/logo-fiable-white.svg"
              alt=""
              aria-hidden="true"
              width={34}
              height={34}
              style={{ height: 34, width: "auto" }}
            />
            <span style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px", lineHeight: 1 }}>
              fiable
            </span>
          </div>

          {/* Tagline */}
          <p className="text-[15px] font-bold leading-snug" style={{ color: "#FFFFFF", lineHeight: 1.3 }}>
            {creative.tagline}
          </p>

          {/* Copy */}
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>
            {creative.copy}
          </p>

          {/* Trust signal */}
          <p className="text-[11px] font-semibold" style={{ color: "#39D98A" }}>
            {creative.trust}
          </p>

          {/* CTA */}
          <span
            className="group-hover:bg-[#047857] flex items-center justify-center gap-1.5 w-full text-[13px] font-bold text-white px-4 py-2.5 rounded-xl transition-colors duration-200"
            style={{ background: "#16A34A" }}
          >
            {creative.cta}
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-[3px]">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </a>
    );
  }

  // ── In-article (horizontal compacto, a mitad del artículo) ───────────────
  if (format === "in-article") {
    return (
      <a
        href={URL_FIABLE}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-[10px] no-underline border border-[#16A34A]/30 hover:border-[#16A34A]/60 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_4px_20px_rgba(22,163,74,0.15)] overflow-hidden"
        aria-label={`Aviso de fiable: ${creative.tagline}`}
        style={{ background: "#0F1F1A", ...fadeIn, fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}
      >
        {/* Borde izquierdo verde */}
        <div className="hidden sm:block w-[3px] self-stretch rounded-full shrink-0" style={{ background: "linear-gradient(to bottom, #16A34A, #39D98A)" }} />

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-1.5" style={{ marginBottom: 2 }}>
            <Image
              src="/fiable/logo-fiable-white.svg"
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              style={{ height: 28, width: "auto" }}
            />
            <span style={{ fontSize: 19, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px", lineHeight: 1 }}>
              fiable
            </span>
          </div>
          <p className="text-[14px] font-bold leading-snug" style={{ color: "#FFFFFF" }}>
            {creative.tagline}
          </p>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.58)" }}>
            {creative.trust}
          </p>
        </div>

        {/* CTA */}
        <span
          className="group-hover:bg-[#047857] flex items-center gap-1.5 shrink-0 self-start sm:self-center text-[12px] font-bold text-white px-4 py-2 rounded-xl transition-colors duration-200 whitespace-nowrap"
          style={{ background: "#16A34A" }}
        >
          {creative.cta}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-[3px]">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>
    );
  }

  // ── End-article (final del artículo, más prominente) ─────────────────────
  return (
    <a
      href={URL_FIABLE}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col gap-5 p-6 rounded-[12px] no-underline border border-[#16A34A]/30 hover:border-[#16A34A]/60 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_32px_rgba(22,163,74,0.18)]"
      aria-label={`Aviso de fiable: ${creative.tagline}`}
      style={{ background: "#0F1F1A", ...fadeIn, fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}
    >
      {/* Logo + badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image
            src="/fiable/logo-fiable-white.svg"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            style={{ height: 40, width: "auto" }}
          />
          <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.4px", lineHeight: 1 }}>
            fiable
          </span>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ color: "#39D98A", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(57,217,138,0.25)" }}
        >
          Solución a medida
        </span>
      </div>

      {/* Tagline */}
      <p className="text-[18px] font-bold leading-snug" style={{ color: "#FFFFFF", lineHeight: 1.25 }}>
        {creative.tagline}
      </p>

      {/* Copy */}
      <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        {creative.copy}
      </p>

      {/* Trust signals */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {creative.trust.split("·").map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "#39D98A" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5.5" stroke="#39D98A" strokeWidth="1"/>
              <path d="M3.5 6l1.8 1.8 3-3" stroke="#39D98A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.trim()}
          </span>
        ))}
      </div>

      {/* CTA */}
      <span
        className="group-hover:bg-[#047857] flex items-center justify-center gap-2 w-full text-[14px] font-bold text-white px-5 py-3 rounded-xl transition-colors duration-200"
        style={{ background: "#16A34A" }}
      >
        {creative.cta}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-[3px]">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </a>
  );
}
