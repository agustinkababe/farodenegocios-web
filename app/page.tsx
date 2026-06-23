import Link from "next/link";

// ── Icono de flecha derecha ───────────────────────────────────────────────
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Icono de check para lista ─────────────────────────────────────────────
function CheckMark() {
  return (
    <span className="mt-[3px] flex-shrink-0 w-[18px] h-[18px] rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path
          d="M1.5 4.5l2 2 4-4"
          stroke="#C7872A"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// ── Botón CTA principal ───────────────────────────────────────────────────
function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-ink font-sans font-semibold px-7 py-3.5 rounded-[6px] text-[15px] leading-none transition-colors duration-150"
    >
      {children}
      <ArrowRight />
    </Link>
  );
}

// ── Home ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-sm border-b border-line">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">

          {/* Logo — placeholder hasta tener el SVG definitivo */}
          <div className="flex items-center gap-2.5" aria-label="Faro de Negocios">
            {/* PLACEHOLDER LOGO: reemplazar este bloque por el SVG real */}
            <div className="w-7 h-7 rounded-[4px] bg-ink flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v4M4 5h6M5 5l-1 7h6l-1-7" stroke="#E0A33E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* FIN PLACEHOLDER LOGO */}
            <span className="font-display text-[17px] font-semibold text-ink tracking-tight">
              Faro de Negocios
            </span>
          </div>

        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="pt-20 pb-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-7">
              Diagnóstico gratuito · PyMEs argentinas
            </p>
            <h1 className="font-display text-[2.75rem] md:text-[3.5rem] font-semibold text-ink leading-[1.12] tracking-tight mb-6">
              ¿Tu negocio está donde<br className="hidden sm:block" /> vos creés que está?
            </h1>
            <p className="font-sans text-[17px] text-warm leading-[1.7] mb-10 max-w-lg mx-auto opacity-80">
              Respondés 10 preguntas sobre cómo funciona tu negocio y te mandamos
              un diagnóstico real: cómo está tu rubro ahora y dónde está el freno
              más grande. Gratis, sin vueltas, en menos de 3 minutos.
            </p>
            <CtaButton href="/encuesta">Hacé el diagnóstico gratis</CtaButton>
            <p className="mt-4 font-sans text-xs text-muted">
              Sin registro previo · Sin compromiso
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-line" />

        {/* ── Cómo funciona ── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[1.6rem] font-semibold text-ink text-center mb-14 tracking-tight">
              Cómo funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  n: "01",
                  title: "Contás cómo funciona tu negocio",
                  desc:  "10 preguntas sobre operación, pedidos, stock y lo que más te pesa. Menos de 3 minutos.",
                },
                {
                  n: "02",
                  title: "Lo cruzamos con el contexto del sector",
                  desc:  "Tu situación puntual + cómo está el rubro ahora mismo. Sin datos inventados.",
                },
                {
                  n: "03",
                  title: "Te llega el informe al mail",
                  desc:  "Diagnóstico honesto: qué está bien, dónde está el freno, y por dónde arrancar.",
                },
              ].map((step) => (
                <div key={step.n} className="flex flex-col gap-3">
                  <span className="font-mono text-[13px] font-medium text-accent">
                    {step.n}
                  </span>
                  <h3 className="font-sans font-semibold text-ink text-[16px] leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[14px] text-muted leading-[1.65]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-line" />

        {/* ── Qué tiene el informe ── */}
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-md mx-auto">
            <h2 className="font-display text-[1.6rem] font-semibold text-ink mb-2 tracking-tight">
              Qué tiene el informe
            </h2>
            <p className="font-sans text-[14px] text-muted mb-8 leading-relaxed">
              Tres cosas concretas, sin relleno ni publicidad.
            </p>
            <ul className="space-y-5">
              {[
                "Cómo está tu rubro ahora mismo — con honestidad, sin endulzar.",
                "Un espejo de tu operación: dónde estás bien y dónde está el freno real.",
                "Una orientación concreta sobre por dónde arrancar si querés resolver algo.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckMark />
                  <span className="font-sans text-[15px] text-warm leading-[1.65]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-line" />

        {/* ── CTA final ── */}
        <section className="py-20 px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="font-display text-[2rem] font-semibold text-ink mb-4 leading-tight tracking-tight">
              Un diagnóstico honesto<br /> no sobra nunca.
            </h2>
            <p className="font-sans text-[15px] text-muted mb-8 leading-[1.7]">
              La mayoría de los dueños de PyME saben que algo no funciona bien
              pero no saben exactamente qué. El informe ayuda a ponerle nombre.
            </p>
            <CtaButton href="/encuesta">Empezar el diagnóstico</CtaButton>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-line py-7 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-display text-[13px] font-medium text-ink">
            Faro de Negocios
          </span>
          <span className="font-sans text-xs text-muted">
            farodenegocios.com.ar
          </span>
        </div>
      </footer>

    </div>
  );
}
