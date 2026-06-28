import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros — Faro de Negocios",
  description:
    "La misión de Faro de Negocios: ayudar a dueños de PyMEs argentinas a entender dónde está parado su negocio y tomar mejores decisiones.",
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Encabezado ── */}
        <section className="pt-14 pb-10 px-6 border-b border-line">
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-3">
              Nosotros
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] font-semibold text-ink leading-tight tracking-tight">
              Un espejo gratuito para el dueño de PyME
            </h1>
          </div>
        </section>

        {/* ── Contenido ── */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">

            <p className="font-sans text-[15px] text-warm leading-[1.8] mb-6">
              La mayoría de los dueños de PyMEs argentinas no tienen forma de saber con claridad dónde está parado su negocio. No porque no les importe — sino porque las herramientas que existen son para empresas grandes, y los consultores son caros. El dueño del comercio, la distribuidora, el taller, queda en el medio: demasiado chico para los sistemas grandes y demasiado solo para tomar decisiones con información real.
            </p>

            <p className="font-sans text-[15px] text-warm leading-[1.8] mb-6">
              Faro de Negocios nació con una idea simple: darle a ese dueño un espejo gratuito. Un diagnóstico honesto que le diga cómo está su negocio, qué está funcionando, dónde hay margen de mejora, y qué puede hacer para resolverlo.
            </p>

            {/* Bloque "Cómo lo hacemos" */}
            <div className="border-l-2 border-accent pl-6 my-10">
              <p className="font-display text-[1.05rem] font-semibold text-ink mb-3">
                Cómo lo hacemos
              </p>
              <p className="font-sans text-[14px] text-warm leading-[1.75] mb-4">
                La herramienta central es el{" "}
                <Link href="/encuesta" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                  diagnóstico gratuito
                </Link>
                : once preguntas, menos de tres minutos, y un informe personalizado que llega por email. Sin trampa, sin venta encubierta. El informe tiene que ser útil aunque el dueño nunca haga nada con él.
              </p>
              <p className="font-sans text-[14px] text-warm leading-[1.75]">
                También publicamos{" "}
                <Link href="/articulos" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                  artículos
                </Link>{" "}
                sobre los temas que le importan a la PyME argentina del día a día: cómo manejar el stock sin volverse loco, cuándo tiene sentido sumar tecnología, qué hacer cuando el WhatsApp se come demasiado tiempo del día.
              </p>
            </div>

            {/* Bloque "Quiénes somos" */}
            <p className="font-display text-[1.05rem] font-semibold text-ink mb-3">
              Quiénes somos
            </p>

            {/*
              TODO: Podés sumar acá tu nombre, tu rol y la historia de cómo surgió el proyecto.
              Ejemplo: "Faro de Negocios es una iniciativa de [tu nombre], [tu rol]."
              La honestidad y la cercanía son parte de la marca — contalo con tu propia voz.
            */}

            <p className="font-sans text-[15px] text-warm leading-[1.8] mb-6">
              Faro de Negocios es una iniciativa del equipo de{" "}
              <a
                href="https://fiable.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors"
              >
                fiable
              </a>
              , un estudio de tecnología para PyMEs que trabaja con negocios que quedaron afuera de las soluciones enlatadas. La tecnología a medida puede ser accesible — esa es la convicción detrás de todo lo que construimos.
            </p>

            <p className="font-sans text-[15px] text-warm leading-[1.8] mb-10">
              Los artículos del portal los firman las{" "}
              <Link href="/equipo" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                voces editoriales
              </Link>{" "}
              de Faro de Negocios — un equipo con perspectivas complementarias sobre operación, ventas, gestión y el contexto económico PyME.
            </p>

            {/* CTA */}
            <div className="bg-surface border border-line rounded-[8px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-[1rem] font-semibold text-ink mb-1">
                  ¿Querés saber cómo está tu negocio?
                </p>
                <p className="font-sans text-[13px] text-muted">
                  El diagnóstico es gratuito y tarda menos de 3 minutos.
                </p>
              </div>
              <Link
                href="/encuesta"
                className="font-sans text-[13px] font-semibold text-ink bg-accent hover:bg-accent-600 px-5 py-2.5 rounded-[6px] transition-colors duration-150 whitespace-nowrap"
              >
                Empezar →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
