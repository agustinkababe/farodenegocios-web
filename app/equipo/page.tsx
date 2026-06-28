import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { AUTORES } from "@/lib/autores";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo editorial — Faro de Negocios",
  description:
    "Las voces editoriales de Faro de Negocios: las firmas con las que se publican los artículos del portal.",
};

export default function EquipoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Encabezado ── */}
        <section className="pt-14 pb-10 px-6 border-b border-line">
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-3">
              Equipo editorial
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] font-semibold text-ink leading-tight tracking-tight">
              Las voces de Faro de Negocios
            </h1>
          </div>
        </section>

        {/* ── Contenido ── */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">

            {/* Nota de transparencia */}
            <div className="bg-surface border border-line rounded-[8px] p-5 mb-10">
              <p className="font-sans text-[13px] text-warm leading-[1.7]">
                Los artículos de Faro de Negocios se firman con <strong className="text-ink">voces editoriales</strong> — Guillermo, Hernán, Josefina y Paula — que representan distintas perspectivas y áreas temáticas dentro del equipo.{" "}
                <strong className="text-ink">No son personas físicas identificables con ese nombre</strong>: son las firmas del medio, cada una con su propio enfoque y territorio editorial. Es una práctica habitual en publicaciones con equipos editoriales — y lo aclaramos porque creemos que la transparencia es parte de la credibilidad.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {AUTORES.map((a) => (
                <div
                  key={a.id}
                  className="bg-surface border border-line rounded-[8px] p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-display text-[1.05rem] font-semibold text-ink mb-0.5">
                        {a.nombre}
                      </p>
                      <p className="font-sans text-[11px] font-semibold text-accent-600 uppercase tracking-wide">
                        {a.area}
                      </p>
                    </div>
                    {/* Inicial decorativa */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-[1rem] font-semibold"
                      style={{ background: "#0C2236", color: "#E0A33E" }}
                    >
                      {a.nombre.charAt(0)}
                    </div>
                  </div>
                  <p className="font-sans text-[13px] text-muted leading-[1.65]">
                    {a.bio}
                  </p>
                </div>
              ))}
            </div>

            <p className="font-sans text-[13px] text-muted mt-10">
              Querés escribirnos o saber más sobre el proyecto →{" "}
              <Link
                href="/contacto"
                className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors"
              >
                Contacto
              </Link>
              {" "}o{" "}
              <Link
                href="/nosotros"
                className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors"
              >
                Nosotros
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
