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
