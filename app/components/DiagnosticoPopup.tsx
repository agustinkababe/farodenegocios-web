"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SESSION_KEY = "fdn_popup_shown";
const SCROLL_THRESHOLD = 0.75;           // 75% de la página para el disparador de scroll
const MIN_SCROLL_FOR_INACTIVITY = 0.40;  // inactividad solo dispara si ya scrolleó ≥40%
const INACTIVITY_DELAY_MS = 30_000;      // 30 segundos de inactividad
const STICKY_SCROLL_PX = 320;
const EXCLUDED = ["/encuesta", "/informe"];

export function DiagnosticoPopup() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const firedRef = useRef(false);

  const isExcluded = EXCLUDED.some((p) => pathname.startsWith(p));

  const closePopup = useCallback(() => setShowPopup(false), []);

  const triggerPopup = useCallback(() => {
    if (firedRef.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage no disponible (ej. iframe sandboxed)
    }
    firedRef.current = true;
    setShowPopup(true);
  }, []);

  useEffect(() => {
    if (isExcluded) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        firedRef.current = true;
      }
    } catch {
      // noop
    }

    // Sticky mobile: aparece tras STICKY_SCROLL_PX
    let stickyDone = false;
    function onScrollSticky() {
      if (!stickyDone && window.scrollY > STICKY_SCROLL_PX) {
        setShowSticky(true);
        stickyDone = true;
        window.removeEventListener("scroll", onScrollSticky);
      }
    }
    window.addEventListener("scroll", onScrollSticky, { passive: true });

    // Exit-intent — desktop (mouseleave con clientY <= 0)
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) triggerPopup();
    }
    document.addEventListener("mouseleave", onMouseLeave);

    // Scroll depth — 60 % de la página
    function onScrollDepth() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= SCROLL_THRESHOLD) {
        triggerPopup();
      }
    }
    window.addEventListener("scroll", onScrollDepth, { passive: true });

    // Inactividad — 30 segundos sin actividad, solo si ya scrolleó ≥40% de la página
    function triggerIfScrolledEnough() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= MIN_SCROLL_FOR_INACTIVITY) {
        triggerPopup();
      }
    }

    let timer: ReturnType<typeof setTimeout>;
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(triggerIfScrolledEnough, INACTIVITY_DELAY_MS);
    }
    const activityEvents = ["mousemove", "keydown", "touchstart", "scroll"] as const;
    activityEvents.forEach((ev) =>
      document.addEventListener(ev, resetTimer, { passive: true })
    );
    resetTimer();

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScrollSticky);
      window.removeEventListener("scroll", onScrollDepth);
      activityEvents.forEach((ev) => document.removeEventListener(ev, resetTimer));
      clearTimeout(timer);
    };
  }, [isExcluded, pathname, triggerPopup]);

  return (
    <>
      {/* ── Popup ── */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Diagnóstico gratuito"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 print:hidden"
          style={{ background: "rgba(12, 34, 54, 0.55)", backdropFilter: "blur(2px)" }}
          onClick={closePopup}
        >
          <div
            className="bg-surface rounded-[12px] border border-line shadow-2xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-muted hover:text-ink transition-colors p-1.5"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-4">
              {/* Ícono de faro pequeño */}
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo/faro-simbolo-color.svg"
                  alt=""
                  aria-hidden="true"
                  style={{ height: 28, width: "auto" }}
                />
                <span className="font-sans text-[11px] font-semibold text-muted uppercase tracking-wide">
                  Faro de Negocios
                </span>
              </div>

              <div>
                <p className="font-display text-[1.15rem] font-semibold text-ink leading-snug">
                  ¿Sabés cómo está parado tu negocio?
                </p>
                <p className="font-sans text-[13px] text-muted mt-2 leading-relaxed">
                  Antes de irte: el diagnóstico gratis te dice en 3 minutos
                  dónde está parado tu negocio frente a los de tu rubro.
                </p>
              </div>

              <Link
                href="/encuesta"
                onClick={closePopup}
                className="block w-full text-center font-sans text-[14px] font-semibold text-ink bg-accent hover:bg-accent-600 px-4 py-3 rounded-[6px] transition-colors duration-150"
              >
                Hacé el diagnóstico →
              </Link>

              <button
                onClick={closePopup}
                className="font-sans text-[12px] text-muted hover:text-ink transition-colors text-center"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky móvil (aparece tras scroll, solo en mobile) ── */}
      {!isExcluded && showSticky && (
        <div className="fixed bottom-4 right-4 z-40 md:hidden print:hidden">
          <Link
            href="/encuesta"
            className="flex items-center gap-1.5 font-sans text-[12px] font-semibold text-ink bg-accent hover:bg-accent-600 px-4 py-2.5 rounded-full shadow-lg transition-colors duration-150 whitespace-nowrap"
          >
            Diagnóstico gratis →
          </Link>
        </div>
      )}
    </>
  );
}
