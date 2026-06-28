"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeaderClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [nosotrosOpen, setNosotrosOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setNosotrosOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-sm border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-[14px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" aria-label="Faro de Negocios — inicio">
          <img
            src="/logo/faro-lockup-horizontal.svg"
            alt="Faro de Negocios"
            height={40}
            style={{ height: 40, width: "auto" }}
          />
        </a>

        {/* ── Nav desktop ── */}
        <nav className="hidden md:flex items-center gap-5" aria-label="Navegación principal">

          <Link
            href="/articulos"
            className="font-sans text-[13px] text-muted hover:text-ink transition-colors duration-150"
          >
            Artículos
          </Link>

          {/* Nosotros + dropdown */}
          <div className="relative group py-1 -my-1">
            <button className="flex items-center gap-1 font-sans text-[13px] text-muted hover:text-ink transition-colors duration-150 cursor-pointer">
              Nosotros
              <ChevronDown className="opacity-60 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 top-full -left-3 pt-1.5 w-48 z-50">
              <div className="bg-surface border border-line rounded-[8px] shadow-lg overflow-hidden">
                <Link
                  href="/nosotros"
                  className="block px-4 py-2.5 font-sans text-[13px] text-warm hover:bg-bg hover:text-ink transition-colors duration-100"
                >
                  La marca
                </Link>
                <Link
                  href="/equipo"
                  className="block px-4 py-2.5 font-sans text-[13px] text-warm hover:bg-bg hover:text-ink transition-colors duration-100"
                >
                  Equipo editorial
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/contacto"
            className="font-sans text-[13px] text-muted hover:text-ink transition-colors duration-150"
          >
            Contacto
          </Link>

          {/* CTA */}
          <Link
            href="/encuesta"
            className="font-sans text-[13px] font-semibold text-ink bg-accent hover:bg-accent-600 px-4 py-[7px] rounded-[6px] transition-colors duration-150 leading-none"
          >
            Diagnóstico gratis
          </Link>
        </nav>

        {/* ── Botón hamburger mobile ── */}
        <button
          className="md:hidden text-muted hover:text-ink transition-colors p-1.5 -mr-1.5"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* ── Menú mobile ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface" role="navigation" aria-label="Menú mobile">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">

            <Link
              href="/articulos"
              className="py-3 font-sans text-[14px] font-medium text-ink border-b border-line/50 block"
            >
              Artículos
            </Link>

            {/* Nosotros */}
            <div>
              <button
                className="w-full flex items-center justify-between py-3 font-sans text-[14px] font-medium text-ink border-b border-line/50"
                onClick={() => setNosotrosOpen(!nosotrosOpen)}
              >
                Nosotros
                <ChevronDown className={`transition-transform duration-200 ${nosotrosOpen ? "rotate-180" : ""}`} />
              </button>
              {nosotrosOpen && (
                <div className="pl-3 pt-1 pb-2 flex flex-col gap-0.5">
                  <Link href="/nosotros" className="py-2 font-sans text-[13px] text-muted hover:text-ink transition-colors block">
                    La marca
                  </Link>
                  <Link href="/equipo" className="py-2 font-sans text-[13px] text-muted hover:text-ink transition-colors block">
                    Equipo editorial
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contacto"
              className="py-3 font-sans text-[14px] font-medium text-ink border-b border-line/50"
            >
              Contacto
            </Link>

            {/* CTA */}
            <div className="pt-3">
              <Link
                href="/encuesta"
                className="block w-full text-center font-sans text-[14px] font-semibold text-ink bg-accent hover:bg-accent-600 px-4 py-3 rounded-[6px] transition-colors duration-150"
              >
                Diagnóstico gratis →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
