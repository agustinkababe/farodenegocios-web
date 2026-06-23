// ── PIPELINE PAUSADO — ver comentario en app/api/admin/staging/route.ts ──────
"use client";

import { useEffect, useState, useCallback } from "react";
import type { DatosSectorStagingRow } from "@/types";

type EditableFields = {
  rubro_encuesta: string;
  rubro_display: string;
  mes_referencia: string;
  variacion_interanual: string;
  variacion_acumulada_anio: string;
  nota_cualitativa: string;
  fuente: string;
};

function toEditable(row: DatosSectorStagingRow): EditableFields {
  return {
    rubro_encuesta: row.rubro_encuesta,
    rubro_display: row.rubro_display,
    mes_referencia: row.mes_referencia,
    variacion_interanual: row.variacion_interanual?.toString() ?? "",
    variacion_acumulada_anio: row.variacion_acumulada_anio?.toString() ?? "",
    nota_cualitativa: row.nota_cualitativa ?? "",
    fuente: row.fuente,
  };
}

export default function AdminDatosClient({ secret }: { secret: string }) {
  const [records, setRecords] = useState<DatosSectorStagingRow[]>([]);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, EditableFields>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", "x-admin-secret": secret };

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/staging", { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al cargar datos");
      setRecords(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [secret]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchPending(); }, [fetchPending]);

  function toggleEdit(id: string, row: DatosSectorStagingRow) {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editValues[id]) {
      setEditValues((prev) => ({ ...prev, [id]: toEditable(row) }));
    }
  }

  function updateField(id: string, field: keyof EditableFields, value: string) {
    setEditValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function aprobar(row: DatosSectorStagingRow) {
    setActionLoading((prev) => ({ ...prev, [row.id]: true }));
    setSuccessMsg(null);
    const vals = editValues[row.id] ?? toEditable(row);
    try {
      const res = await fetch(`/api/admin/staging/${row.id}/aprobar`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          rubro_encuesta: vals.rubro_encuesta,
          rubro_display: vals.rubro_display,
          mes_referencia: vals.mes_referencia,
          variacion_interanual: vals.variacion_interanual !== "" ? Number(vals.variacion_interanual) : null,
          variacion_acumulada_anio: vals.variacion_acumulada_anio !== "" ? Number(vals.variacion_acumulada_anio) : null,
          nota_cualitativa: vals.nota_cualitativa || null,
          fuente: vals.fuente,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al aprobar");
      setSuccessMsg(`✓ Aprobado: ${vals.rubro_display} (${vals.mes_referencia})`);
      setRecords((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setActionLoading((prev) => ({ ...prev, [row.id]: false }));
    }
  }

  async function rechazar(row: DatosSectorStagingRow) {
    setActionLoading((prev) => ({ ...prev, [row.id]: true }));
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/staging/${row.id}/rechazar`, {
        method: "POST",
        headers,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al rechazar");
      setSuccessMsg(`✗ Rechazado: ${row.rubro_display} (${row.mes_referencia})`);
      setRecords((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setActionLoading((prev) => ({ ...prev, [row.id]: false }));
    }
  }

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
        Admin — Datos de sector pendientes
      </h1>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
        Staging → Validación → Producción. Solo aparecen los registros en estado "pendiente".
        {/* TODO: Proteger con auth real antes de producción */}
      </p>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #ef4444", padding: "0.75rem", marginBottom: "1rem", borderRadius: 4 }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: "#dcfce7", border: "1px solid #22c55e", padding: "0.75rem", marginBottom: "1rem", borderRadius: 4 }}>
          {successMsg}
        </div>
      )}

      <button
        onClick={fetchPending}
        style={{ marginBottom: "1.5rem", padding: "0.4rem 1rem", cursor: "pointer" }}
      >
        Recargar
      </button>

      {loading && <p>Cargando...</p>}

      {!loading && records.length === 0 && (
        <p style={{ color: "#666" }}>No hay registros pendientes.</p>
      )}

      {records.map((row) => {
        const isEditing = !!editMode[row.id];
        const vals = editValues[row.id] ?? toEditable(row);
        const busy = !!actionLoading[row.id];

        return (
          <div
            key={row.id}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "1rem",
              marginBottom: "1rem",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <Field label="Rubro (key)" value={vals.rubro_encuesta} editing={isEditing}
                onChange={(v) => updateField(row.id, "rubro_encuesta", v)} />
              <Field label="Rubro (display)" value={vals.rubro_display} editing={isEditing}
                onChange={(v) => updateField(row.id, "rubro_display", v)} />
              <Field label="Mes referencia" value={vals.mes_referencia} editing={isEditing}
                onChange={(v) => updateField(row.id, "mes_referencia", v)} />
              <Field label="Var. interanual %" value={vals.variacion_interanual} editing={isEditing}
                onChange={(v) => updateField(row.id, "variacion_interanual", v)} />
              <Field label="Var. acum. año %" value={vals.variacion_acumulada_anio} editing={isEditing}
                onChange={(v) => updateField(row.id, "variacion_acumulada_anio", v)} />
              <Field label="Fuente" value={vals.fuente} editing={isEditing}
                onChange={(v) => updateField(row.id, "fuente", v)} />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Nota cualitativa</span>
              {isEditing ? (
                <textarea
                  value={vals.nota_cualitativa}
                  onChange={(e) => updateField(row.id, "nota_cualitativa", e.target.value)}
                  rows={2}
                  style={{ display: "block", width: "100%", fontFamily: "monospace", fontSize: "0.85rem", marginTop: 2 }}
                />
              ) : (
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: vals.nota_cualitativa ? "#111" : "#aaa" }}>
                  {vals.nota_cualitativa || "(sin nota)"}
                </p>
              )}
            </div>

            {row.origen && (
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.75rem" }}>
                Origen: {row.origen}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => aprobar(row)}
                disabled={busy}
                style={{ background: "#16a34a", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: 4, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}
              >
                APROBAR
              </button>
              <button
                onClick={() => toggleEdit(row.id, row)}
                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: 4, cursor: "pointer" }}
              >
                {isEditing ? "CANCELAR EDICIÓN" : "CORREGIR"}
              </button>
              <button
                onClick={() => rechazar(row)}
                disabled={busy}
                style={{ background: "#dc2626", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: 4, cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1 }}
              >
                RECHAZAR
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ minWidth: 120 }}>
      <span style={{ display: "block", fontSize: "0.75rem", color: "#6b7280" }}>{label}</span>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontFamily: "monospace", fontSize: "0.9rem", padding: "2px 4px", width: "100%" }}
        />
      ) : (
        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{value || "—"}</span>
      )}
    </div>
  );
}
