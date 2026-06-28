export type RespuestasEncuesta = {
  rubro: string;
  cantidad_empleados: string;
  antiguedad: string;
  canal_pedidos: string;
  control_stock: string;
  tiempo_respuesta: string;
  vende_online: string;
  tarea_repetitiva: string;
  volumen_consultas: string; // opcional — rangos de consultas por día
  horas_tarea: string;       // opcional — horas/semana que consume la tarea que más pesa
  email: string;
};

export type EncuestaRow = RespuestasEncuesta & {
  id: string;
  created_at: string;
  unsubscribe_token: string | null;
  unsubscribed_at: string | null;
  clickeo_at: string | null;       // clic al informe (analytics, no frena cadencia)
  clic_fiable_at: string | null;   // clic al link de fiable (SÍ frena la cadencia)
  enviado_informe_at: string | null;
  enviado_seguimiento1_at: string | null;
  enviado_seguimiento2_at: string | null;
};

export type DatosSectorRow = {
  id: string;
  rubro_display: string;
  rubro_encuesta: string;
  variacion_interanual: number | null;
  variacion_acumulada_anio: number | null;
  mes_referencia: string;
  nota_cualitativa: string | null;
  fuente: string;
  fecha_actualizacion: string;
};

export type DatosSectorStagingRow = DatosSectorRow & {
  estado: "pendiente" | "aprobado" | "rechazado";
  fecha_parseo: string;
  origen: string | null;
};

export type ArticuloTipo = "educativo" | "coyuntura" | "como-hacer" | "casos";

export type ArticuloTemaRow = {
  id: string;
  titulo: string;
  tipo: ArticuloTipo;
  estado: "propuesto" | "aprobado" | "rechazado";
  hash: string;
  created_at: string;
};

export type ArticuloRow = {
  id: string;
  tema_id: string | null;
  titulo: string;
  slug: string;
  cuerpo: string;
  tipo: ArticuloTipo;
  estado: "borrador" | "publicado" | "rechazado";
  hash: string;
  modelo_usado: string | null;
  portada_url: string | null;
  portada_keywords: string | null;
  portada_credito: string | null;
  created_at: string;
  updated_at: string;
};

export type InformeRow = {
  id: string;
  encuesta_id: string;
  created_at: string;
  rubro_clasificado: string | null;
  titulo: string;
  seccion_sector: string;
  seccion_espejo: string;
  seccion_cierre: string;
  modelo_usado: string | null;
  email_enviado_at: string | null;
};
