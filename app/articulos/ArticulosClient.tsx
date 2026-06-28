"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { asignarAutor } from "@/lib/autores";

import type { ArticuloTipo } from "@/types";

type ArticuloResumen = {
  id: string;
  titulo: string;
  slug: string;
  tipo: ArticuloTipo;
  cuerpo: string;
  portada_url: string | null;
  autor: string | null;
  created_at: string;
};

function normalizar(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extractExcerpt(cuerpo: string, maxLen = 155): string {
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

export function ArticulosClient({ articulos }: { articulos: ArticuloResumen[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const filtrados = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return articulos;
    return articulos.filter((a) => {
      return normalizar(a.titulo).includes(q) || normalizar(a.cuerpo).includes(q);
    });
  }, [query, articulos]);

  const buscando = query.trim().length > 0;

  return (
    <>
      {/* ── Buscador ── */}
      <section className="py-8 px-6 border-b border-line bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artículos…"
              aria-label="Buscar artículos"
              className="w-full pl-10 pr-4 py-3 rounded-[6px] bg-bg border border-line text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-navy-500 transition-colors duration-150"
            />
          </div>
        </div>
      </section>

      {/* ── Resultados ── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {filtrados.length === 0 && buscando ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <p className="font-sans text-[15px] text-muted">
                No encontramos artículos sobre eso — probá con otras palabras.
              </p>
              <button
                onClick={() => setQuery("")}
                className="font-sans text-[13px] font-semibold text-navy-700 underline underline-offset-2 hover:text-ink transition-colors"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-[15px] text-muted">
                Aún no hay artículos publicados.
              </p>
            </div>
          ) : (
            <>
              {buscando && (
                <p className="font-sans text-[13px] text-muted mb-6">
                  {filtrados.length === 1
                    ? "1 artículo encontrado"
                    : `${filtrados.length} artículos encontrados`}
                </p>
              )}
              <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 rounded-[8px] overflow-hidden border border-line">
                {filtrados.map((a) => (
                  <ArticuloCard key={a.id} articulo={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function TipoBadge({ tipo }: { tipo: ArticuloTipo }) {
  if (tipo === "educativo") return null;
  const map: Record<Exclude<ArticuloTipo, "educativo">, { label: string; cls: string }> = {
    coyuntura:  { label: "Contexto",    cls: "text-accent-600 bg-accent/10" },
    "como-hacer": { label: "Cómo hacer", cls: "text-navy-700 bg-[#18405F]/10" },
    casos:      { label: "Caso",        cls: "text-muted bg-line/60" },
  };
  const { label, cls } = map[tipo];
  return (
    <span className={`font-sans text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

function ArticuloCard({ articulo }: { articulo: ArticuloResumen }) {
  const excerpt = extractExcerpt(articulo.cuerpo);
  const fecha = formatDate(articulo.created_at);
  const autor = articulo.autor ?? asignarAutor(articulo.id).nombre;

  return (
    <Link
      href={`/articulos/${articulo.slug}`}
      className="group flex flex-col bg-surface hover:bg-bg transition-colors duration-150 overflow-hidden"
    >
      <PortadaCard portadaUrl={articulo.portada_url} titulo={articulo.titulo} articuloId={articulo.id} />

      <div className="flex flex-col gap-3 p-6 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-medium text-muted uppercase tracking-wide">
            {fecha}
          </span>
          <TipoBadge tipo={articulo.tipo} />
        </div>

        <h2 className="font-display text-[1.1rem] font-semibold text-ink leading-snug group-hover:text-navy-700 transition-colors duration-150">
          {articulo.titulo}
        </h2>

        <p className="font-sans text-[13px] text-muted leading-[1.65] flex-1">
          {excerpt}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-sans text-[11px] text-muted">
            Por {autor}
          </span>
          <span className="font-sans text-[12px] font-semibold text-navy-700 flex items-center gap-1">
            Leer
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Paleta de fondos para el fallback — alterna según el ID del artículo
const FALLBACK_BG = ["#0C2236", "#18405F"] as const;

function fallbackBg(articuloId: string): string {
  let h = 0;
  for (let i = 0; i < articuloId.length; i++) {
    h = (h * 31 + articuloId.charCodeAt(i)) & 0xffffffff;
  }
  return FALLBACK_BG[Math.abs(h) % FALLBACK_BG.length];
}

export function PortadaCard({
  portadaUrl,
  titulo,
  articuloId,
  height = "h-[140px]",
}: {
  portadaUrl: string | null;
  titulo: string;
  articuloId?: string;
  height?: string;
}) {
  if (portadaUrl) {
    return (
      <div className={`${height} overflow-hidden bg-line`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portadaUrl}
          alt={titulo}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
    );
  }

  const bg = articuloId ? fallbackBg(articuloId) : "#0C2236";

  // Fallback editorial: fondo de marca, símbolo + título del artículo
  return (
    <div
      className={`${height} flex flex-col items-center justify-center gap-2.5 px-5 pb-4 pt-5`}
      style={{ background: bg }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/faro-simbolo-color.svg"
        alt=""
        aria-hidden="true"
        style={{ height: 26, width: "auto", opacity: 0.6, flexShrink: 0 }}
      />
      <p
        className="font-display text-[11px] font-semibold text-center leading-[1.45] line-clamp-2"
        style={{ color: "#FFFDF8", opacity: 0.85 }}
      >
        {titulo}
      </p>
    </div>
  );
}
