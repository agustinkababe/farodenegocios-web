# Faro de Negocios

Portal para PyMEs argentinas. Stack: Next.js + Supabase + Vercel.

## Setup local

1. Clonar el repo e instalar dependencias:

```bash
npm install
```

2. Copiar las variables de entorno:

```bash
cp .env.example .env.local
```

3. Editar `.env.local` con las credenciales de tu proyecto de Supabase (las conseguís en supabase.com → Settings → API).

4. Levantar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno necesarias

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública del proyecto Supabase |

## Estructura de carpetas

```
app/
  page.tsx              # Home
  encuesta/             # Flujo de encuesta (próximamente)
  informe/              # Visualización del informe (próximamente)
  articulos/            # Artículos del portal (próximamente)
  api/
    encuesta/           # Endpoint que recibe respuestas
    informe/            # Endpoint que genera el informe con IA
lib/
  supabase.ts           # Cliente de Supabase
types/
  index.ts              # Tipos compartidos
```

## Deploy

El proyecto está configurado para deploy directo en Vercel. Solo hay que conectar el repo y setear las mismas variables de entorno en el dashboard de Vercel.
