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
  title: "Política de privacidad — Faro de Negocios",
  description: "Cómo Faro de Negocios recopila, usa y protege tus datos personales.",
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

export default function PrivacidadPage() {
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
              Política de privacidad
            </h1>
            <p className="font-sans text-[13px] text-muted mt-3">
              Última actualización: {FECHA_ACTUALIZACION}
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">

            <div className="bg-surface border border-line rounded-[8px] p-5 mb-8">
              <p className="font-sans text-[13px] text-muted leading-[1.65]">
                Esta política describe de forma honesta qué datos recopila Faro de Negocios, para qué los usa y cómo podés ejercer tus derechos. Si tenés dudas, escribinos a{" "}
                {/* TODO: Reemplazá con el email real */}
                <a href="mailto:hola@farodenegocios.com.ar" className="text-navy-700 underline underline-offset-2">hola@farodenegocios.com.ar</a>.
              </p>
            </div>

            <Heading>Qué datos recopilamos</Heading>
            <P>
              Cuando completás el diagnóstico gratuito, recopilamos: tu dirección de email y las respuestas a las preguntas de la encuesta (rubro, cantidad de empleados, canales de venta, principales tareas). Estas respuestas no incluyen datos sensibles ni información financiera detallada.
            </P>
            <P>
              No pedimos nombre, teléfono, CUIT ni ningún otro dato de identificación personal más allá del email.
            </P>

            <Heading>Para qué usamos tus datos</Heading>
            <P>
              Usamos tu email y tus respuestas exclusivamente para:
            </P>
            <ul className="font-sans text-[14px] text-warm leading-[1.75] mb-4 pl-5 flex flex-col gap-2 list-disc">
              <li>Generar tu informe de diagnóstico personalizado.</li>
              <li>Enviarte ese informe por email.</li>
              <li>Enviarte hasta dos emails de seguimiento relacionados con el diagnóstico (en los días siguientes a la entrega del informe).</li>
            </ul>
            <P>
              No vendemos, cedemos ni compartimos tu email con terceros para fines comerciales. No usamos tus datos para publicidad de terceros.
            </P>

            <Heading>Terceros que intervienen en el proceso</Heading>
            <P>
              Para brindarte el servicio, usamos los siguientes proveedores:
            </P>
            <ul className="font-sans text-[14px] text-warm leading-[1.75] mb-4 pl-5 flex flex-col gap-2 list-disc">
              <li><strong className="text-ink">Supabase</strong> — base de datos donde se almacenan las respuestas y el email.</li>
              <li><strong className="text-ink">Resend</strong> — servicio de envío de emails transaccionales.</li>
              <li><strong className="text-ink">Vercel</strong> — plataforma de hosting donde corre el sitio.</li>
              <li><strong className="text-ink">OpenAI</strong> — proveedor de IA que genera el texto del informe personalizado a partir de tus respuestas. Usamos los modelos de OpenAI con las condiciones de uso vigentes de su plataforma.</li>
            </ul>
            <P>
              Cada uno de estos proveedores tiene su propia política de privacidad y estándares de seguridad.
            </P>

            <Heading>Cuánto tiempo conservamos tus datos</Heading>
            <P>
              Conservamos tu email y tus respuestas mientras el servicio esté activo o hasta que solicites su eliminación. Una vez dada la baja de comunicaciones, tu email permanece en nuestra base con el estado "dado de baja" para no volverte a contactar por error.
            </P>

            <Heading>Cómo darte de baja de nuestros emails</Heading>
            <P>
              Cada email que te enviamos incluye un link de baja en el pie. Al hacer click, dejamos de enviarte comunicaciones de inmediato. También podés escribirnos a{" "}
              <a href="mailto:hola@farodenegocios.com.ar" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">hola@farodenegocios.com.ar</a>{" "}
              {/* TODO: Reemplazá con el email real */}
              y procesamos la baja en menos de 24 horas.
            </P>

            <Heading>Cómo solicitar la eliminación de tus datos</Heading>
            <P>
              Podés solicitar la eliminación completa de tu email y tus respuestas escribiéndonos a{" "}
              <a href="mailto:hola@farodenegocios.com.ar" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">hola@farodenegocios.com.ar</a>.
              {/* TODO: Reemplazá con el email real */}
              {" "}Procesamos las solicitudes de eliminación en un plazo de 30 días.
            </P>

            <Heading>Cookies y seguimiento</Heading>
            <P>
              El sitio no utiliza cookies de seguimiento de terceros ni herramientas de analítica de comportamiento de usuarios en esta etapa.
            </P>

            <Heading>Cambios a esta política</Heading>
            <P>
              Si actualizamos esta política, lo indicaremos con la fecha de revisión al inicio del documento. Para cambios relevantes, notificaremos por email a los usuarios registrados.
            </P>

            <div className="border-t border-line mt-10 pt-6">
              <P>
                ¿Tenés preguntas sobre cómo manejamos tus datos?{" "}
                <Link href="/contacto" className="text-navy-700 underline underline-offset-2 hover:text-ink transition-colors">
                  Escribinos
                </Link>
                .
              </P>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
