import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase-server";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { AdSlot } from "@/app/components/ads/AdSlot";
import { FiableAd } from "@/app/components/ads/FiableAd";
import { ArticulosClient } from "./ArticulosClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artículos — Faro de Negocios",
  description:
    "Guías y contexto para dueños de PyMEs argentinas: operación, tecnología, ventas y el día a día del negocio.",
};

export const revalidate = 300; // 5 minutos: artículos se publican 3x/semana

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

    if (error) console.error("[articulos] error:", error.message);
    if (!error && data) articulos = data as ArticuloResumen[];
  } catch (err) {
    console.error("[articulos] excepción:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        {/*
          Layout de dos columnas: contenido principal + sidebar (xl+).
          El hero y el leaderboard viven DENTRO de la columna principal
          para que max-w-5xl mx-auto alinee con la grilla de artículos.
        */}
        <div className="flex items-start">

          {/* ── Columna principal ── */}
          <div className="flex-1 min-w-0">

            {/* Cabecera */}
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

            {/* Ad slot: leaderboard — alineado con la grilla */}
            <div className="px-6 py-4 border-b border-line bg-surface">
              <div className="max-w-5xl mx-auto">
                <AdSlot format="leaderboard" />
              </div>
            </div>

            {/* Grilla de artículos */}
            <Suspense fallback={null}>
              <ArticulosClient articulos={articulos} />
            </Suspense>

          </div>{/* fin columna principal */}

          {/* ── Sidebar — visible en desktop (xl+) ── */}
          <aside
            className="hidden xl:flex flex-col gap-5 w-[300px] shrink-0 border-l border-line px-5 pt-10 pb-16 self-stretch"
            aria-label="Publicidad lateral"
          >
            <div className="sticky top-20 flex flex-col gap-5">
              <AdSlot format="rectangle" />
              <FiableAd format="sidebar" />
            </div>
          </aside>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
