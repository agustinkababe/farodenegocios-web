import { notFound } from "next/navigation";
import { marked } from "marked";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { asignarAutor } from "@/lib/autores";
import type { Metadata } from "next";
import type { ArticuloTipo } from "@/types";

function splitHtmlAtMidpoint(html: string): [string, string] {
  if (html.length < 800) return [html, ""];
  const half = Math.floor(html.length / 2);
  const idx = html.indexOf("</p>", half);
  if (idx === -1) return [html, ""];
  return [html.slice(0, idx + 4), html.slice(idx + 4)];
}

export const revalidate = 3600;

// ── Utilidades ─────────────────────────────────────────────────────────────

function extractExcerpt(cuerpo: string, maxLen = 160): string {
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type CreditoUnsplash = {
  nombre: string;
  perfil_url: string;
  foto_url: string;
};

function parseCredito(credito: string | null): CreditoUnsplash | null {
  if (!credito) return null;
  try {
    return JSON.parse(credito) as CreditoUnsplash;
  } catch {
    return null;
  }
}

// ── Tipos ──────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
};

type ArticuloCompleto = {
  id: string;
  titulo: string;
  slug: string;
  tipo: ArticuloTipo;
  cuerpo: string;
  portada_url: string | null;
  portada_credito: string | null;
  autor: string | null;
  created_at: string;
};

type ArticuloRelacionado = {
  id: string;
  titulo: string;
  slug: string;
  tipo: ArticuloTipo;
  cuerpo: string;
  portada_url: string | null;
  autor: string | null;
  created_at: string;
};

// ── Metadata dinámica ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let articulo: Pick<ArticuloCompleto, "titulo" | "slug" | "cuerpo" | "portada_url" | "created_at"> | null = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("articulos")
      .select("titulo, slug, cuerpo, portada_url, created_at")
      .eq("slug", slug)
      .eq("estado", "publicado")
      .single();
    articulo = data;
  } catch {
    // noop
  }

  if (!articulo) return { title: "Artículo — Faro de Negocios" };

  const description = extractExcerpt(articulo.cuerpo);
  const siteUrl = process.env.SITE_URL ?? "https://farodenegocios.com.ar";

  return {
    title: `${articulo.titulo} — Faro de Negocios`,
    description,
    openGraph: {
      title: articulo.titulo,
      description,
      url: `${siteUrl}/articulos/${articulo.slug}`,
      siteName: "Faro de Negocios",
      locale: "es_AR",
      type: "article",
      publishedTime: articulo.created_at,
      ...(articulo.portada_url ? { images: [{ url: articulo.portada_url }] } : {}),
    },
    twitter: {
      card: articulo.portada_url ? "summary_large_image" : "summary",
      title: articulo.titulo,
      description,
      ...(articulo.portada_url ? { images: [articulo.portada_url] } : {}),
    },
  };
}

// ── Página ─────────────────────────────────────────────────────────────────

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;

  let articulo: ArticuloCompleto | null = null;
  let relacionados: ArticuloRelacionado[] = [];

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("articulos")
      .select("id, titulo, slug, tipo, cuerpo, portada_url, portada_credito, created_at")
      .eq("slug", slug)
      .eq("estado", "publicado")
      .single();

    if (!error && data) articulo = data as ArticuloCompleto;

    if (articulo) {
      const { data: candidatos } = await supabase
        .from("articulos")
        .select("id, titulo, slug, tipo, cuerpo, portada_url, created_at")
        .eq("estado", "publicado")
        .neq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(10);

      if (candidatos) {
        const mismoTipo = candidatos.filter((a) => a.tipo === articulo!.tipo);
        const otroTipo = candidatos.filter((a) => a.tipo !== articulo!.tipo);
        relacionados = [...mismoTipo, ...otroTipo].slice(0, 3) as ArticuloRelacionado[];
      }
    }
  } catch {
    // noop
  }

  if (!articulo) return notFound();

  const htmlBody = await marked.parse(articulo.cuerpo, { breaks: true });
  const [bodyFirst, bodySecond] = splitHtmlAtMidpoint(htmlBody);
  const fecha = formatDate(articulo.created_at);
  const credito = parseCredito(articulo.portada_credito);
  const autorNombre = articulo.autor ?? asignarAutor(articulo.id).nombre;

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-warm">
      <SiteHeader />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 py-14">

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 font-sans text-xs text-muted mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/articulos" className="hover:text-ink transition-colors">Artículos</Link>
            <span aria-hidden="true">›</span>
            <span className="text-warm truncate max-w-[200px]">{articulo.titulo}</span>
          </nav>

          {/* Metadata + firma */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5">
            <span className="font-mono text-[12px] text-muted">{fecha}</span>
            <span className="text-line" aria-hidden="true">·</span>
            <Link
              href="/nosotros"
              className="font-sans text-[12px] text-muted hover:text-ink transition-colors"
            >
              Por {autorNombre}
            </Link>
            {articulo.tipo !== "educativo" && (
              <>
                <span className="text-line" aria-hidden="true">·</span>
                <TipoBadge tipo={articulo.tipo} />
              </>
            )}
          </div>

          {/* Título */}
          <h1 className="font-display text-[2rem] md:text-[2.4rem] font-semibold text-ink leading-[1.2] tracking-tight mb-8">
            {articulo.titulo}
          </h1>

          {/* Portada */}
          {articulo.portada_url ? (
            <div className="mb-10 rounded-[8px] overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articulo.portada_url}
                alt={articulo.titulo}
                className="w-full h-[280px] sm:h-[340px] object-cover"
              />
              {credito && (
                <p className="px-3 py-2 font-sans text-[11px] text-muted bg-surface border-t border-line">
                  Foto de{" "}
                  <a
                    href={credito.perfil_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-ink transition-colors"
                  >
                    {credito.nombre}
                  </a>{" "}
                  en{" "}
                  <a
                    href={credito.foto_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-ink transition-colors"
                  >
                    Unsplash
                  </a>
                </p>
              )}
            </div>
          ) : (
            // Fallback editorial: fondo de marca, símbolo + título
            <div
              className="mb-10 rounded-[8px] overflow-hidden border border-line h-[220px] sm:h-[280px] flex flex-col items-center justify-center gap-5 px-8"
              style={{
                background:
                  articulo.id.charCodeAt(0) % 2 === 0 ? "#0C2236" : "#18405F",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/faro-simbolo-color.svg"
                alt=""
                aria-hidden="true"
                style={{ height: 52, width: "auto", opacity: 0.55 }}
              />
              <p
                className="font-display text-[1.15rem] sm:text-[1.35rem] font-semibold text-center leading-[1.3] max-w-md"
                style={{ color: "#FFFDF8", opacity: 0.88 }}
              >
                {articulo.titulo}
              </p>
            </div>
          )}

          {/* Cuerpo — primera mitad */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: bodyFirst }}
          />

          {/* Callout diagnóstico — mitad del artículo */}
          {bodySecond && (
            <div className="my-8 rounded-[8px] border border-accent/40 bg-accent/[0.06] p-5 flex flex-col sm:flex-row sm:items-center gap-4 not-prose">
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[13px] font-semibold text-ink leading-snug">
                  ¿Cómo está parado tu negocio frente a los de tu rubro?
                </p>
                <p className="font-sans text-[12px] text-muted mt-1 leading-relaxed">
                  Diagnóstico gratuito para PyMEs. Tres minutos, sin costo, resultado inmediato.
                </p>
              </div>
              <Link
                href="/encuesta"
                className="font-sans text-[13px] font-semibold text-ink bg-accent hover:bg-accent-600 px-4 py-2.5 rounded-[6px] transition-colors duration-150 whitespace-nowrap self-start sm:self-center shrink-0"
              >
                Hacé el diagnóstico →
              </Link>
            </div>
          )}

          {/* Cuerpo — segunda mitad */}
          {bodySecond && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: bodySecond }}
            />
          )}

        </article>
      </main>

      {/* ── Artículos relacionados ── */}
      {relacionados.length > 0 && (
        <section className="border-t border-line py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-[1.25rem] font-semibold text-ink mb-8">
              Artículos relacionados
            </h2>
            <div className="grid gap-px bg-line sm:grid-cols-3 rounded-[8px] overflow-hidden border border-line">
              {relacionados.map((r) => (
                <RelacionadoCard key={r.id} articulo={r} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/articulos"
                className="font-sans text-[13px] font-semibold text-navy-700 border border-line hover:border-navy-500 px-5 py-2.5 rounded-[6px] transition-colors duration-150 inline-block"
              >
                Ver todos los artículos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Fallback si no hay relacionados */}
      {relacionados.length === 0 && (
        <section className="border-t border-line py-10 px-6 bg-surface">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-[1.1rem] font-semibold text-ink">
                Más artículos para tu negocio
              </p>
              <p className="font-sans text-[13px] text-muted mt-0.5">
                Guías y contexto para el día a día de la PyME argentina.
              </p>
            </div>
            <Link
              href="/articulos"
              className="font-sans text-[13px] font-semibold text-navy-700 border border-line hover:border-navy-500 px-5 py-2.5 rounded-[6px] transition-colors duration-150 whitespace-nowrap"
            >
              Ver todos →
            </Link>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

// ── Badge de tipo ─────────────────────────────────────────────────────────

function TipoBadge({ tipo }: { tipo: ArticuloTipo }) {
  if (tipo === "educativo") return null;
  const map: Record<Exclude<ArticuloTipo, "educativo">, { label: string; cls: string }> = {
    coyuntura:    { label: "Contexto",    cls: "text-accent-600 bg-accent/10" },
    "como-hacer": { label: "Cómo hacer", cls: "text-navy-700 bg-[#18405F]/10" },
    casos:        { label: "Caso",        cls: "text-muted bg-line/60" },
  };
  const { label, cls } = map[tipo];
  return (
    <span className={`font-sans text-[11px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// ── Tarjeta relacionado ────────────────────────────────────────────────────

function RelacionadoCard({ articulo }: { articulo: ArticuloRelacionado }) {
  const excerpt = extractExcerpt(articulo.cuerpo, 100);
  const autorNombre = articulo.autor ?? asignarAutor(articulo.id).nombre;

  return (
    <Link
      href={`/articulos/${articulo.slug}`}
      className="group flex flex-col bg-surface hover:bg-bg transition-colors duration-150 overflow-hidden"
    >
      {/* Portada mini */}
      {articulo.portada_url ? (
        <div className="h-[100px] overflow-hidden bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={articulo.portada_url}
            alt={articulo.titulo}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      ) : (
        <div
          className="h-[100px] flex flex-col items-center justify-center gap-1.5 px-4"
          style={{
            background:
              articulo.id.charCodeAt(0) % 2 === 0 ? "#0C2236" : "#18405F",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/faro-simbolo-color.svg"
            alt=""
            aria-hidden="true"
            style={{ height: 20, width: "auto", opacity: 0.55, flexShrink: 0 }}
          />
          <p
            className="font-display text-[10px] font-semibold text-center leading-[1.4] line-clamp-2"
            style={{ color: "#FFFDF8", opacity: 0.8 }}
          >
            {articulo.titulo}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-display text-[0.95rem] font-semibold text-ink leading-snug group-hover:text-navy-700 transition-colors duration-150">
          {articulo.titulo}
        </h3>
        <p className="font-sans text-[12px] text-muted leading-[1.6] flex-1">
          {excerpt}
        </p>
        <span className="font-sans text-[11px] text-muted mt-1">
          Por {autorNombre}
        </span>
      </div>
    </Link>
  );
}
