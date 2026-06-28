export type Autor = {
  id: string;
  nombre: string;
  area: string;
  bio: string;
};

export const AUTORES: Autor[] = [
  {
    id: "guillermo",
    nombre: "Guillermo Rivas",
    area: "Operación y tecnología",
    bio: "Escribe sobre sistemas, herramientas y procesos para el negocio del día a día.",
  },
  {
    id: "hernan",
    nombre: "Hernán Castaño",
    area: "Economía PyME",
    bio: "Analiza el contexto macroeconómico argentino y cómo impacta en el comercio chico.",
  },
  {
    id: "josefina",
    nombre: "Josefina Méndez",
    area: "Ventas y clientes",
    bio: "Cubre atención al cliente, experiencia de compra y estrategias de venta para la PyME.",
  },
  {
    id: "paula",
    nombre: "Paula Serrano",
    area: "Gestión y finanzas",
    bio: "Aborda la organización interna, los números del negocio y la toma de decisiones.",
  },
];

// Asigna un autor de forma determinística y estable para el mismo articuloId
export function asignarAutor(articuloId: string): Autor {
  let h = 0;
  for (let i = 0; i < articuloId.length; i++) {
    h = (h * 31 + articuloId.charCodeAt(i)) & 0xffffffff;
  }
  return AUTORES[Math.abs(h) % AUTORES.length];
}
