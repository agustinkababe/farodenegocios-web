import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase-server";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { ArticulosClient } from "./ArticulosClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artículos — Faro de Negocios",
  description:
    "Guías y contexto para dueños de PyMEs argentinas: operación, tecnología, ventas y el día a día del negocio.",
};

export const revalidate = 60;

type ArticuloResumen = {
  id: string;
  titulo: string;
  slug: string;
  tipo: "educativo" | "coyuntura";
  cuerpo: string;
  portada_url: string | null;
  autor: string | null;
  created_at: string;
};

export default async function ArticulosPage() {
  let articulos: ArticuloResumen[] = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articulos")
      .select("id, titulo, slug, tipo, cuerpo, portada_url, created_at")
      .eq("estado", "publicado")
      .order("created_at", { ascending: false });

    if (!error && data) articulos = data as ArticuloResumen[];
  } catch {
    // En dev sin DB configurada, muestra estado vacío
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Cabecera ── */}
        <section className="pt-14 pb-10 px-6 border-b border-line">
          <div className="max-w-5xl mx-auto">
            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-[0.12em] mb-3">
              Artículos
            </p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] font-semibold text-ink leading-tight tracking-tight">
              Para dueños de PyME que quieren entender qué pasa
            </h1>
          </div>
        </section>

        <Suspense fallback={null}>
          <ArticulosClient articulos={articulos} />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
