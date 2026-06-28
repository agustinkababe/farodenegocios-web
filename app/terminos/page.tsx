/*
  ⚠️  TEXTO BASE PARA ETAPA DE DEMO
  Este texto fue redactado como punto de partida honesto, NO como asesoría legal.
  DEBE ser revisado y validado por un abogado especializado antes de usar en
  producción real o con usuarios reales. No representa asesoría legal.
*/

import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones — Faro de Negocios",
  description: "Condiciones de uso del sitio y los servicios de Faro de Negocios.",
};

const FECHA_ACTUALIZACION = "Junio 2026"; // TODO: Actualizá esta fecha cuando revisés el texto con un abogado

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[1.15rem] font-semibold text-ink mt-10 mb-3">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[14px] text-warm leading-[1.75] mb-4">
      {children}
    </p>
  );
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        <section className="pt-14 pb-10 px-6 border-b border-line">
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-3">
              Legal
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] font-semibold text-ink leading-tight tracking-tight">
              Términos y condiciones
            </h1>
            <p className="font-sans text-[13px] text-muted mt-3">
              Última actualización: {FECHA_ACTUALIZACION}
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">

            <P>
              Al usar este sitio y sus servicios, aceptás las condiciones descritas en este documento. Si no las aceptás, te pedimos que no uses el servicio.
            </P>

            <Heading>El servicio</Heading>
            <P>
              Faro de Negocios ofrece un diagnóstico gratuito para dueños de PyMEs argentinas. El servicio consiste en una encuesta de once preguntas y un informe generado automáticamente a partir de las respuestas, entregado por email. El servicio es completamente gratuito.
            </P>
            <P>
              Nos reservamos el derecho de modificar, interrumpir o discontinuar el servicio en cualquier momento, sin previo aviso.
            </P>

            <Heading>El contenido y el diagnóstico</Heading>
            <P>
              El informe de diagnóstico y los artículos publicados en el sitio son de carácter <strong className="text-ink">informativo y editorial</strong>. No constituyen asesoría profesional (contable, legal, financiera ni de ninguna otra índole).
            </P>
            <P>
              El diagnóstico es una herramienta de reflexión basada en las respuestas que el usuario provee. Faro de Negocios no garantiza que las conclusiones del informe representen con exactitud la situación del negocio ni que las sugerencias sean adecuadas para cada caso particular.
            </P>
            <P>
              Para decisiones importantes de negocio, te recomendamos consultar con un profesional especializado.
            </P>

            <Heading>Datos del usuario</Heading>
            <P>
              Al completar la encuesta, el usuario acepta que sus datos (email y respuestas) sean procesados según nuestra{" "}
              <Link href="/privacidad" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                política de privacidad
              </Link>
              .
            </P>

            <Heading>Propiedad intelectual</Heading>
            <P>
              El contenido del sitio (artículos, textos, diseño, marca) es propiedad de Faro de Negocios o de sus licenciantes. No podés reproducir, distribuir ni usar el contenido con fines comerciales sin autorización expresa.
            </P>

            <Heading>Limitación de responsabilidad</Heading>
            <P>
              Faro de Negocios no se responsabiliza por daños directos ni indirectos derivados del uso del servicio o de las decisiones tomadas en base al diagnóstico o al contenido del sitio.
            </P>

            <Heading>Ley aplicable</Heading>
            <P>
              {/* TODO: Confirmar jurisdicción con un abogado */}
              Este acuerdo se rige por las leyes de la República Argentina. Cualquier disputa se resolverá en los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
            </P>

            <Heading>Contacto</Heading>
            <P>
              Para consultas sobre estos términos, escribinos a{" "}
              {/* TODO: Reemplazá con el email real */}
              <a href="mailto:hola@farodenegocios.com.ar" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                hola@farodenegocios.com.ar
              </a>{" "}
              o visitá nuestra página de{" "}
              <Link href="/contacto" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                contacto
              </Link>
              .
            </P>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
