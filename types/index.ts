export type RespuestasEncuesta = {
  rubro: string;
  cantidad_empleados: string;
  antiguedad: string;
  canal_pedidos: string;
  control_stock: string;
  tiempo_respuesta: string;
  volumen_consultas: string; // opcional — puede ser string vacío si el usuario saltea
  vende_online: string;
  tarea_repetitiva: string;
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
  variacion_acumulada: number | null;
  periodo: string;
  notas: string | null;
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
};
