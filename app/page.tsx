import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

export const revalidate = 60;

// ── Íconos ────────────────────────────────────────────────────────────────

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

// ── Utilidades ────────────────────────────────────────────────────────────

function extractExcerpt(cuerpo: string, maxLen = 120): string {
  const plain = cuerpo
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s\S*$/, "") + "…";
}

type ArticuloPreview = {
  id: string;
  titulo: string;
  slug: string;
  tipo: "educativo" | "coyuntura";
  cuerpo: string;
};

// ── Home ─────────────────────────────────────────────────────────────────

export default async function HomePage() {
  // Artículos recientes para la sección de vidriera
  let articulosRecientes: ArticuloPreview[] = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("articulos")
      .select("id, titulo, slug, tipo, cuerpo")
      .eq("estado", "publicado")
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) articulosRecientes = data as ArticuloPreview[];
  } catch {
    // Sin DB configurada en dev → estado vacío
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

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

        {/* ── Artículos recientes ── */}
        {articulosRecientes.length > 0 && (
          <>
            <section className="py-16 px-6 bg-surface">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-end justify-between mb-10 gap-4">
                  <div>
                    <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-2">
                      Del portal
                    </p>
                    <h2 className="font-display text-[1.6rem] font-semibold text-ink tracking-tight">
                      Para entender qué pasa
                    </h2>
                  </div>
                  <Link
                    href="/articulos"
                    className="font-sans text-[13px] font-semibold text-navy-700 hover:text-ink flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    Ver todos <ArrowRight />
                  </Link>
                </div>

                <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 rounded-[8px] overflow-hidden border border-line">
                  {articulosRecientes.map((a) => (
                    <Link
                      key={a.id}
                      href={`/articulos/${a.slug}`}
                      className="group flex flex-col gap-3 bg-surface p-6 hover:bg-bg transition-colors duration-150"
                    >
                      {a.tipo === "coyuntura" && (
                        <span className="self-start font-sans text-[10px] font-semibold text-accent-600 bg-accent/10 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                          Contexto
                        </span>
                      )}
                      <h3 className="font-display text-[1.05rem] font-semibold text-ink leading-snug group-hover:text-navy-700 transition-colors duration-150">
                        {a.titulo}
                      </h3>
                      <p className="font-sans text-[13px] text-muted leading-[1.65] flex-1">
                        {extractExcerpt(a.cuerpo)}
                      </p>
                      <span className="font-sans text-[12px] font-semibold text-navy-700 flex items-center gap-1 mt-1">
                        Leer
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <div className="border-t border-line" />
          </>
        )}

        {/* ── Cómo funciona ── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[1.6rem] font-semibold text-ink text-center mb-14 tracking-tight">
              Cómo funciona el diagnóstico
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  n: "01",
                  title: "Contás cómo funciona tu negocio",
                  desc: "10 preguntas sobre operación, pedidos, stock y lo que más te pesa. Menos de 3 minutos.",
                },
                {
                  n: "02",
                  title: "Lo cruzamos con el contexto del sector",
                  desc: "Tu situación puntual + cómo está el rubro ahora mismo. Sin datos inventados.",
                },
                {
                  n: "03",
                  title: "Te llega el informe al mail",
                  desc: "Diagnóstico honesto: qué está bien, dónde está el freno, y por dónde arrancar.",
                },
              ].map((step) => (
                <div key={step.n} className="flex flex-col gap-3">
                  <span className="font-mono text-[13px] font-medium text-accent">{step.n}</span>
                  <h3 className="font-sans font-semibold text-ink text-[16px] leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[14px] text-muted leading-[1.65]">{step.desc}</p>
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
                  <span className="font-sans text-[15px] text-warm leading-[1.65]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-line" />

        {/* ── Bloque inline diagnóstico (entre contenido y CTA final) ── */}
        <section className="py-14 px-6">
          <div className="max-w-2xl mx-auto bg-ink rounded-[12px] px-8 py-10 text-center">
            <p className="font-sans text-xs font-semibold text-accent uppercase tracking-[0.12em] mb-4">
              Diagnóstico gratuito
            </p>
            <h2 className="font-display text-[1.7rem] font-semibold text-surface leading-tight tracking-tight mb-4">
              ¿Sabés cuál es el freno más grande de tu negocio?
            </h2>
            <p className="font-sans text-[14px] text-surface/70 leading-[1.7] mb-7">
              Menos de 3 minutos. Recibirás un informe real a tu mail, no un PDF genérico.
            </p>
            <Link
              href="/encuesta"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-ink font-sans font-semibold px-7 py-3.5 rounded-[6px] text-[15px] leading-none transition-colors duration-150"
            >
              Empezar el diagnóstico
              <ArrowRight />
            </Link>
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

      <SiteFooter />
    </div>
  );
}
