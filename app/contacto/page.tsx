import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Faro de Negocios",
  description: "Escribinos con dudas sobre el diagnóstico, sugerencias de contenido, o para charlar sobre tu negocio.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        <section className="pt-14 pb-10 px-6 border-b border-line">
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-3">
              Contacto
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] font-semibold text-ink leading-tight tracking-tight">
              Escribinos
            </h1>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">

            <p className="font-sans text-[15px] text-warm leading-[1.75] mb-10">
              Para dudas sobre el diagnóstico, sugerencias de contenido, o simplemente para charlar sobre tu negocio — escribinos.
            </p>

            <div className="flex flex-col gap-5">

              {/* Email */}
              {/* TODO: Reemplazá hola@farodenegocios.com.ar por el email real de contacto */}
              <a
                href="mailto:hola@farodenegocios.com.ar"
                className="group flex items-center gap-4 bg-surface border border-line hover:border-navy-500 rounded-[8px] p-5 transition-colors duration-150"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0C2236" }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="2" y="5" width="16" height="11" rx="2" stroke="#E0A33E" strokeWidth="1.5" />
                    <path d="M2 7l8 5 8-5" stroke="#E0A33E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-sans text-[13px] font-semibold text-ink group-hover:text-navy-700 transition-colors">
                    hola@farodenegocios.com.ar
                  </p>
                  <p className="font-sans text-[12px] text-muted mt-0.5">
                    Respondemos en menos de 48 horas
                  </p>
                </div>
              </a>

              {/* Instagram */}
              {/* TODO: Reemplazá el href con la URL real de Instagram una vez creada la cuenta */}
              <a
                href="https://instagram.com/farodenegocios"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-surface border border-line hover:border-navy-500 rounded-[8px] p-5 transition-colors duration-150"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0C2236" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E0A33E" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4" stroke="#E0A33E" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="#E0A33E" />
                  </svg>
                </div>
                <div>
                  <p className="font-sans text-[13px] font-semibold text-ink group-hover:text-navy-700 transition-colors">
                    @farodenegocios
                  </p>
                  <p className="font-sans text-[12px] text-muted mt-0.5">
                    Instagram
                  </p>
                </div>
              </a>

              {/* LinkedIn */}
              {/* TODO: Reemplazá el href con la URL real del perfil de LinkedIn */}
              <a
                href="https://linkedin.com/company/farodenegocios"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-surface border border-line hover:border-navy-500 rounded-[8px] p-5 transition-colors duration-150"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0C2236" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="#E0A33E" strokeWidth="1.5" />
                    <path d="M7 10v7M7 7v.5" stroke="#E0A33E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M11 10v7" stroke="#E0A33E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-sans text-[13px] font-semibold text-ink group-hover:text-navy-700 transition-colors">
                    LinkedIn
                  </p>
                  <p className="font-sans text-[12px] text-muted mt-0.5">
                    Faro de Negocios
                  </p>
                </div>
              </a>
            </div>

            <p className="font-sans text-[13px] text-muted mt-10">
              Para darte de baja de nuestros emails, usá el link que aparece al pie de cada mail que te enviamos. También podés escribirnos a la dirección de arriba y lo gestionamos en 24 horas. Más información en nuestra{" "}
              <Link href="/privacidad" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                política de privacidad
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
