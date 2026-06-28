"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Respuestas = {
  rubro: string;
  cantidad_empleados: string;
  antiguedad: string;
  canal_pedidos: string;
  control_stock: string;
  tiempo_respuesta: string;
  vende_online: string;
  tarea_repetitiva: string;
  volumen_consultas: string;
  horas_tarea: string;
  email: string;
};

type PasoBase = {
  pregunta: string;
  detalle?: string;
  campo: keyof Respuestas;
  opcional?: boolean;
};

type PasoRadio    = PasoBase & { tipo: "radio";    opciones: string[] };
type PasoTextarea = PasoBase & { tipo: "textarea"; placeholder: string };
type PasoEmail    = PasoBase & { tipo: "email";    placeholder: string };
type Paso = PasoRadio | PasoTextarea | PasoEmail;

const PASOS: Paso[] = [
  {
    tipo: "radio",
    pregunta: "¿A qué se dedica tu negocio?",
    campo: "rubro",
    opciones: [
      "Alimentos y bebidas",
      "Bazar, decoración o mueblería",
      "Calzado o marroquinería",
      "Farmacia o perfumería",
      "Ferretería o materiales de construcción",
      "Textiles e indumentaria",
      "Otro",
    ],
  },
  {
    tipo: "radio",
    pregunta: "¿Cuántas personas trabajan con vos?",
    campo: "cantidad_empleados",
    opciones: ["Solo yo", "2 a 5", "6 a 20", "Más de 20"],
  },
  {
    tipo: "radio",
    pregunta: "¿Hace cuánto que tenés el negocio?",
    campo: "antiguedad",
    opciones: ["Menos de 1 año", "1 a 3 años", "3 a 10 años", "Más de 10 años"],
  },
  {
    tipo: "radio",
    pregunta: "¿Cómo te llegan la mayoría de los pedidos o consultas?",
    campo: "canal_pedidos",
    opciones: [
      "WhatsApp",
      "Teléfono",
      "Local o showroom",
      "Redes sociales",
      "Página web o tienda online",
    ],
  },
  {
    tipo: "radio",
    pregunta: "¿Cómo llevás el control de lo que vendés y tenés en stock?",
    campo: "control_stock",
    opciones: [
      "Papel o de memoria",
      "Excel o planilla",
      "Un sistema de gestión",
      "No lo llevo",
    ],
  },
  {
    tipo: "radio",
    pregunta: "Cuando te llega una consulta, ¿en cuánto solés responder?",
    campo: "tiempo_respuesta",
    opciones: [
      "Al toque",
      "En horas",
      "Al otro día",
      "Como puedo (cuando tengo tiempo)",
    ],
  },
  {
    tipo: "radio",
    pregunta: "¿Vendés online?",
    campo: "vende_online",
    opciones: [
      "No, solo vendo presencial",
      "Por redes, a mano",
      "Tengo tienda online",
    ],
  },
  {
    tipo: "textarea",
    pregunta:
      "Si pudieras sacarte de encima una sola tarea repetitiva, ¿cuál sería?",
    detalle:
      "Contanos con tus palabras. Esta es la pregunta más importante — cuanto más específico, más útil va a ser tu diagnóstico.",
    campo: "tarea_repetitiva",
    placeholder:
      "Por ejemplo: responder siempre las mismas preguntas por WhatsApp, hacer el control de caja a mano, cargar pedidos uno por uno...",
  },
  {
    tipo: "radio",
    opcional: true,
    pregunta: "Más o menos, ¿cuántos clientes o consultas manejás por día?",
    campo: "volumen_consultas",
    opciones: ["Menos de 10", "Entre 10 y 30", "Entre 30 y 50", "Más de 50"],
  },
  {
    tipo: "radio",
    opcional: true,
    pregunta:
      "¿Cuántas horas por semana, más o menos, te consume esa tarea que más te pesa?",
    campo: "horas_tarea",
    opciones: [
      "Menos de 5 horas",
      "Entre 5 y 10 horas",
      "Entre 10 y 20 horas",
      "Más de 20 horas",
    ],
  },
  {
    tipo: "email",
    pregunta: "¿A dónde te mandamos tu informe?",
    detalle: "Gratis, sin spam. Solo tu diagnóstico.",
    campo: "email",
    placeholder: "tucorreo@gmail.com",
  },
];

const RESPUESTAS_INICIALES: Respuestas = {
  rubro: "",
  cantidad_empleados: "",
  antiguedad: "",
  canal_pedidos: "",
  control_stock: "",
  tiempo_respuesta: "",
  vende_online: "",
  tarea_repetitiva: "",
  volumen_consultas: "",
  horas_tarea: "",
  email: "",
};

export default function EncuestaPage() {
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>(RESPUESTAS_INICIALES);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  const pasoActual  = PASOS[paso];
  const totalPasos  = PASOS.length;
  const valorActual = respuestas[pasoActual.campo];
  const porcentaje  = Math.round((paso / totalPasos) * 100);

  const setValor = (val: string) => {
    setRespuestas((prev) => ({ ...prev, [pasoActual.campo]: val }));
    setError("");
  };

  const seleccionarYAvanzar = (opcion: string) => {
    setRespuestas((prev) => ({ ...prev, [pasoActual.campo]: opcion }));
    setError("");
    setTimeout(() => setPaso((p) => p + 1), 220);
  };

  const saltear = () => {
    setError("");
    setPaso((p) => p + 1);
  };

  const avanzar = async () => {
    if (!valorActual.trim()) {
      setError("Este campo no puede quedar vacío.");
      return;
    }

    if (pasoActual.tipo === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorActual)) {
        setError("Ingresá un email válido.");
        return;
      }
      await enviar();
      return;
    }

    setError("");
    setPaso((p) => p + 1);
  };

  const retroceder = () => {
    setError("");
    setPaso((p) => p - 1);
  };

  const enviar = async () => {
    setEnviando(true);
    try {
      const res = await fetch("/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respuestas),
      });

      const data = await res.json().catch(() => ({})) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!res.ok || !data.id) {
        throw new Error(data.error ?? "Error desconocido");
      }

      router.push(`/informe/${data.id}`);
    } catch {
      setError("Hubo un problema al enviar. Intentá de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans">

      {/* ── Header con barra de progreso ── */}
      <header className="bg-surface border-b border-line px-4 py-3.5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <img
              src="/logo/faro-lockup-horizontal.svg"
              alt="Faro de Negocios"
              height={36}
              style={{ height: 36, width: "auto" }}
            />
            <span className="text-xs text-muted">
              {paso + 1} de {totalPasos}
            </span>
          </div>
          <div className="h-1 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── Banner intro — solo en el primer paso ── */}
      {paso === 0 && (
        <div className="bg-ink text-white px-4 py-7">
          <div className="max-w-lg mx-auto">
            <h1 className="font-display text-2xl font-semibold leading-snug">
              ¿Cómo está tu negocio frente a los de tu rubro?
            </h1>
            <p className="mt-2 text-white/60 text-sm leading-relaxed font-sans">
              Respondé unas preguntas cortas y te mandamos un diagnóstico
              gratuito con datos reales de tu sector. Menos de 3 minutos.
            </p>
          </div>
        </div>
      )}

      {/* ── Contenido del paso ── */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto">

          {/* Pregunta */}
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-ink leading-snug">
              {pasoActual.pregunta}
            </h2>
            {pasoActual.detalle && (
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {pasoActual.detalle}
              </p>
            )}
          </div>

          {/* Opciones (radio) */}
          {pasoActual.tipo === "radio" && (
            <>
              <div className="space-y-2">
                {pasoActual.opciones.map((opcion) => {
                  const seleccionado = valorActual === opcion;
                  return (
                    <button
                      key={opcion}
                      onClick={() => seleccionarYAvanzar(opcion)}
                      className={[
                        "w-full text-left px-4 py-3.5 rounded-[6px] border text-sm transition-all duration-150",
                        seleccionado
                          ? "border-ink bg-ink/5 text-ink font-semibold"
                          : "border-line bg-surface text-warm hover:border-navy-500 hover:bg-surface",
                      ].join(" ")}
                    >
                      {opcion}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center gap-4">
                {paso > 0 && (
                  <button
                    onClick={retroceder}
                    className="text-sm text-muted hover:text-warm transition-colors"
                  >
                    Atrás
                  </button>
                )}
                {pasoActual.opcional && (
                  <button
                    onClick={saltear}
                    className="text-sm text-muted hover:text-warm transition-colors"
                  >
                    Salteá esta pregunta
                  </button>
                )}
              </div>
            </>
          )}

          {/* Texto libre */}
          {pasoActual.tipo === "textarea" && (
            <textarea
              rows={5}
              value={valorActual}
              onChange={(e) => setValor(e.target.value)}
              placeholder={pasoActual.placeholder}
              className="w-full rounded-[6px] border border-line bg-surface px-4 py-3 text-sm text-warm placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/60 transition-colors"
            />
          )}

          {/* Email */}
          {pasoActual.tipo === "email" && (
            <input
              type="email"
              value={valorActual}
              onChange={(e) => setValor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && avanzar()}
              placeholder={pasoActual.placeholder}
              className="w-full rounded-[6px] border border-line bg-surface px-4 py-3.5 text-sm text-warm placeholder-muted focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/60 transition-colors"
            />
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          {/* Botones para textarea y email */}
          {(pasoActual.tipo === "textarea" || pasoActual.tipo === "email") && (
            <div className="mt-5 flex items-center gap-3">
              {paso > 0 && (
                <button
                  onClick={retroceder}
                  className="px-4 py-2.5 text-sm text-muted hover:text-warm transition-colors"
                >
                  Atrás
                </button>
              )}
              <button
                onClick={avanzar}
                disabled={enviando}
                className="flex-1 bg-accent hover:bg-accent-600 disabled:opacity-60 text-ink font-semibold rounded-[6px] py-3 text-sm transition-colors"
              >
                {enviando
                  ? "Enviando..."
                  : pasoActual.tipo === "email"
                  ? "Quiero mi informe"
                  : "Continuar"}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
