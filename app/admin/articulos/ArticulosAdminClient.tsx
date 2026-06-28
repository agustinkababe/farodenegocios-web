"use client";

import { useEffect, useState, useCallback } from "react";
import type { ArticuloTemaRow, ArticuloRow } from "@/types";

// ── Estilos inline (admin funcional, sin dependencia de Tailwind) ──────────────
const s = {
  page:    { fontFamily: "monospace", maxWidth: 980, margin: "0 auto", padding: "2rem" },
  h1:      { fontSize: "1.4rem", marginBottom: "0.25rem" },
  sub:     { color: "#666", fontSize: "0.8rem", marginBottom: "2rem" },
  section: { marginBottom: "3rem" },
  h2:      { fontSize: "1.1rem", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.4rem", marginBottom: "1rem" },
  alert:   (type: "error" | "success") => ({
    background: type === "error" ? "#fee2e2" : "#dcfce7",
    border: `1px solid ${type === "error" ? "#ef4444" : "#22c55e"}`,
    padding: "0.6rem 1rem", marginBottom: "1rem", borderRadius: 4, fontSize: "0.85rem",
  }),
  card:    (highlight?: boolean) => ({
    border: highlight ? "1px solid #f59e0b" : "1px solid #d1d5db",
    borderRadius: 6, padding: "0.85rem 1rem", marginBottom: "0.75rem",
    background: highlight ? "#fffbeb" : "#fafafa",
  }),
  badge:   (tipo: string) => ({
    display: "inline-block", fontSize: "0.7rem", fontWeight: 700,
    padding: "1px 7px", borderRadius: 10, marginRight: "0.4rem",
    background: tipo === "coyuntura" ? "#fef3c7" : "#eff6ff",
    color: tipo === "coyuntura" ? "#b45309" : "#1d4ed8",
    border: `1px solid ${tipo === "coyuntura" ? "#fde68a" : "#bfdbfe"}`,
  }),
  estadoBadge: (estado: string) => ({
    display: "inline-block", fontSize: "0.7rem", padding: "1px 7px",
    borderRadius: 10, marginRight: "0.4rem",
    background:
      estado === "publicado" || estado === "aprobado" ? "#dcfce7" :
      estado === "rechazado" ? "#fee2e2" : "#f3f4f6",
    color:
      estado === "publicado" || estado === "aprobado" ? "#16a34a" :
      estado === "rechazado" ? "#dc2626" : "#6b7280",
  }),
  btn:     (color: string, disabled?: boolean) => ({
    background: color, color: "#fff", border: "none",
    padding: "0.35rem 0.85rem", borderRadius: 4, fontSize: "0.8rem",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    marginRight: "0.4rem",
  }),
  btnOutline: (disabled?: boolean) => ({
    background: "transparent", color: "#374151",
    border: "1px solid #d1d5db", padding: "0.35rem 0.85rem",
    borderRadius: 4, fontSize: "0.8rem",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    marginRight: "0.4rem",
  }),
  cuerpo: {
    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 4,
    padding: "0.75rem", marginTop: "0.75rem", fontSize: "0.8rem",
    lineHeight: 1.7, whiteSpace: "pre-wrap" as const, maxHeight: 400, overflowY: "auto" as const,
  },
  input: {
    fontFamily: "monospace", fontSize: "0.85rem", padding: "4px 8px",
    border: "1px solid #d1d5db", borderRadius: 4, width: "100%", boxSizing: "border-box" as const,
  },
};

// ── Sección TEMAS ──────────────────────────────────────────────────────────────

function SeccionTemas({ headers }: { headers: Record<string, string> }) {
  const [temas, setTemas] = useState<ArticuloTemaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [proponiendo, setProponiendo] = useState(false);
  const [editTitulo, setEditTitulo] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [filtro, setFiltro] = useState<string>("propuesto");

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/articulos/temas${filtro !== "todos" ? `?estado=${filtro}` : ""}`,
        { headers }
      );
      const json = await res.json() as { data?: ArticuloTemaRow[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setTemas(json.data ?? []);
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setLoading(false);
    }
  }, [filtro, headers]);

  useEffect(() => { cargar(); }, [cargar]);

  async function proponer() {
    setProponiendo(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/articulos/temas/proponer", { method: "POST", headers });
      const json = await res.json() as { ok?: boolean; insertados?: number; duplicados?: number; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `Lote generado: ${json.insertados} temas nuevos (${json.duplicados} duplicados omitidos).` });
      cargar();
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setProponiendo(false);
    }
  }

  async function aprobar(tema: ArticuloTemaRow) {
    setActionLoading((p) => ({ ...p, [tema.id]: true }));
    try {
      const titulo = editTitulo[tema.id]?.trim() || undefined;
      const res = await fetch(`/api/admin/articulos/temas/${tema.id}/aprobar`, {
        method: "POST", headers,
        body: titulo ? JSON.stringify({ titulo }) : undefined,
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `Aprobado: ${titulo ?? tema.titulo}` });
      cargar();
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setActionLoading((p) => ({ ...p, [tema.id]: false }));
    }
  }

  async function rechazar(tema: ArticuloTemaRow) {
    setActionLoading((p) => ({ ...p, [tema.id]: true }));
    try {
      const res = await fetch(`/api/admin/articulos/temas/${tema.id}/rechazar`, { method: "POST", headers });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `Rechazado: ${tema.titulo}` });
      cargar();
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setActionLoading((p) => ({ ...p, [tema.id]: false }));
    }
  }

  async function generar(tema: ArticuloTemaRow) {
    if (!confirm(`¿Generar artículo para:\n"${tema.titulo}"?\n\nEsto llama a la IA.`)) return;
    setActionLoading((p) => ({ ...p, [tema.id]: true }));
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/articulos/temas/${tema.id}/generar`, { method: "POST", headers });
      const json = await res.json() as { ok?: boolean; articulo?: { id: string; titulo: string }; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `✓ Artículo generado en borrador: "${json.articulo?.titulo}"` });
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setActionLoading((p) => ({ ...p, [tema.id]: false }));
    }
  }

  return (
    <div style={s.section}>
      <h2 style={s.h2}>TEMAS</h2>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button onClick={proponer} disabled={proponiendo} style={s.btn("#0C2236", proponiendo)}>
          {proponiendo ? "Generando lote con IA…" : "Proponer nuevo lote (IA)"}
        </button>
        <button onClick={cargar} style={s.btnOutline()}>Recargar</button>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ fontFamily: "monospace", fontSize: "0.8rem", padding: "0.35rem 0.6rem", border: "1px solid #d1d5db", borderRadius: 4 }}
        >
          <option value="propuesto">Propuestos</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {msg && <div style={s.alert(msg.type)}>{msg.text}</div>}
      {loading && <p style={{ color: "#666", fontSize: "0.85rem" }}>Cargando…</p>}
      {!loading && temas.length === 0 && (
        <p style={{ color: "#999", fontSize: "0.85rem" }}>
          {filtro === "propuesto" ? "Sin temas propuestos. Generá un lote." : "Sin resultados."}
        </p>
      )}

      {temas.map((tema) => {
        const isCoyuntura = tema.tipo === "coyuntura";
        const busy = !!actionLoading[tema.id];
        const isExpanded = expandedId === tema.id;

        return (
          <div key={tema.id} style={s.card(isCoyuntura)}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <span style={s.badge(tema.tipo)}>{tema.tipo}</span>
              <span style={s.estadoBadge(tema.estado)}>{tema.estado}</span>
              {isCoyuntura && (
                <span style={{ fontSize: "0.7rem", color: "#b45309", fontWeight: 700 }}>
                  ⚠ Requiere revisión de datos al generar
                </span>
              )}
            </div>

            {tema.estado === "propuesto" ? (
              <input
                style={s.input}
                value={editTitulo[tema.id] ?? tema.titulo}
                onChange={(e) => setEditTitulo((p) => ({ ...p, [tema.id]: e.target.value }))}
                title="Editá el título antes de aprobar"
              />
            ) : (
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>{tema.titulo}</p>
            )}

            <p style={{ margin: "0.3rem 0 0.6rem", fontSize: "0.72rem", color: "#9ca3af" }}>
              {new Date(tema.created_at).toLocaleString("es-AR")} · id: {tema.id.slice(0, 8)}
            </p>

            <div style={{ marginTop: "0.5rem" }}>
              {tema.estado === "propuesto" && (
                <>
                  <button onClick={() => aprobar(tema)} disabled={busy} style={s.btn("#16a34a", busy)}>APROBAR</button>
                  <button onClick={() => rechazar(tema)} disabled={busy} style={s.btn("#dc2626", busy)}>RECHAZAR</button>
                </>
              )}
              {tema.estado === "aprobado" && (
                <button onClick={() => generar(tema)} disabled={busy} style={s.btn("#0C2236", busy)}>
                  {busy ? "Generando…" : "GENERAR ARTÍCULO (IA)"}
                </button>
              )}
              <button
                onClick={() => setExpandedId(isExpanded ? null : tema.id)}
                style={s.btnOutline()}
              >
                {isExpanded ? "Ocultar" : "Detalle"}
              </button>
            </div>

            {isExpanded && (
              <div style={s.cuerpo}>
                hash: {tema.hash}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Sección ARTÍCULOS ──────────────────────────────────────────────────────────

function SeccionArticulos({ headers }: { headers: Record<string, string> }) {
  const [articulos, setArticulos] = useState<ArticuloRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [filtro, setFiltro] = useState<string>("borrador");

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/articulos${filtro !== "todos" ? `?estado=${filtro}` : ""}`,
        { headers }
      );
      const json = await res.json() as { data?: ArticuloRow[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setArticulos(json.data ?? []);
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setLoading(false);
    }
  }, [filtro, headers]);

  // Carga artículo completo con cuerpo (lazy, solo al expandir)
  const [cuerpos, setCuerpos] = useState<Record<string, string>>({});

  async function expandir(art: ArticuloRow) {
    const nuevoId = expandedId === art.id ? null : art.id;
    setExpandedId(nuevoId);
    if (nuevoId && !cuerpos[art.id]) {
      // Fetch cuerpo completo
      const res = await fetch(`/api/admin/articulos?estado=todos`, { headers });
      // Fallback: buscamos en el listado general (cuerpo viene en la lista completa)
      // Para no sobrecargar, el cuerpo ya lo tenemos si fue retornado — veamos si la API lo incluye
      // La API de listado NO incluye cuerpo (solo metadatos). Hacemos fetch individual.
      // Como no tenemos GET /api/admin/articulos/[id], usamos el listado sin filtro y buscamos el id.
      // MEJOR: incluir cuerpo en el listado (no es tan grande en la mayoría de los casos).
      // Por ahora: fetch del listado completo y extraer.
      if (res.ok) {
        const json = await res.json() as { data?: ArticuloRow[] };
        const found = (json.data ?? []).find((a) => a.id === art.id);
        if (found && "cuerpo" in found) {
          setCuerpos((p) => ({ ...p, [art.id]: (found as { cuerpo: string }).cuerpo }));
        }
      }
    }
  }

  useEffect(() => { cargar(); }, [cargar]);

  async function publicar(art: ArticuloRow) {
    if (!confirm(`¿Publicar "${art.titulo}"?`)) return;
    setActionLoading((p) => ({ ...p, [art.id]: true }));
    try {
      const res = await fetch(`/api/admin/articulos/${art.id}/publicar`, { method: "POST", headers });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `Publicado: "${art.titulo}"` });
      cargar();
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setActionLoading((p) => ({ ...p, [art.id]: false }));
    }
  }

  async function rechazar(art: ArticuloRow) {
    setActionLoading((p) => ({ ...p, [art.id]: true }));
    try {
      const res = await fetch(`/api/admin/articulos/${art.id}/rechazar`, { method: "POST", headers });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg({ type: "success", text: `Rechazado: "${art.titulo}"` });
      cargar();
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setActionLoading((p) => ({ ...p, [art.id]: false }));
    }
  }

  return (
    <div style={s.section}>
      <h2 style={s.h2}>ARTÍCULOS</h2>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button onClick={cargar} style={s.btnOutline()}>Recargar</button>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ fontFamily: "monospace", fontSize: "0.8rem", padding: "0.35rem 0.6rem", border: "1px solid #d1d5db", borderRadius: 4 }}
        >
          <option value="borrador">Borradores</option>
          <option value="publicado">Publicados</option>
          <option value="rechazado">Rechazados</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {msg && <div style={s.alert(msg.type)}>{msg.text}</div>}
      {loading && <p style={{ color: "#666", fontSize: "0.85rem" }}>Cargando…</p>}
      {!loading && articulos.length === 0 && (
        <p style={{ color: "#999", fontSize: "0.85rem" }}>
          {filtro === "borrador" ? "Sin borradores. Generá artículos aprobando temas." : "Sin resultados."}
        </p>
      )}

      {articulos.map((art) => {
        const isCoyuntura = art.tipo === "coyuntura";
        const busy = !!actionLoading[art.id];
        const isExpanded = expandedId === art.id;

        return (
          <div key={art.id} style={s.card(isCoyuntura && art.estado === "borrador")}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
              <span style={s.badge(art.tipo)}>{art.tipo}</span>
              <span style={s.estadoBadge(art.estado)}>{art.estado}</span>
              {isCoyuntura && art.estado === "borrador" && (
                <span style={{ fontSize: "0.7rem", color: "#b45309", fontWeight: 700 }}>
                  ⚠ Coyuntura: revisar [DATO:…] antes de publicar
                </span>
              )}
            </div>

            <p style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: 600 }}>{art.titulo}</p>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
              slug: <code>{art.slug}</code>
            </p>
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.72rem", color: "#9ca3af" }}>
              {new Date(art.created_at).toLocaleString("es-AR")} · modelo: {art.modelo_usado ?? "—"} · id: {art.id.slice(0, 8)}
            </p>

            <div style={{ marginTop: "0.5rem" }}>
              {art.estado === "borrador" && (
                <>
                  <button onClick={() => publicar(art)} disabled={busy} style={s.btn("#16a34a", busy)}>PUBLICAR</button>
                  <button onClick={() => rechazar(art)} disabled={busy} style={s.btn("#dc2626", busy)}>RECHAZAR</button>
                </>
              )}
              <button onClick={() => expandir(art)} style={s.btnOutline()}>
                {isExpanded ? "Ocultar artículo" : "Leer artículo"}
              </button>
            </div>

            {isExpanded && (
              <div style={s.cuerpo}>
                {cuerpos[art.id] ?? "Cargando cuerpo…"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function ArticulosAdminClient({ secret }: { secret: string }) {
  const headers = {
    "Content-Type": "application/json",
    "x-admin-secret": secret,
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Admin — Motor de artículos</h1>
      <p style={s.sub}>
        Flujo: Proponer temas → Aprobar/editar → Generar artículo (IA) → Revisar borrador → Publicar.
        Los de tipo "coyuntura" tienen revisión obligatoria antes de publicar.
        {/* TODO: Proteger con auth real antes de producción */}
      </p>

      <SeccionTemas headers={headers} />
      <SeccionArticulos headers={headers} />
    </div>
  );
}
