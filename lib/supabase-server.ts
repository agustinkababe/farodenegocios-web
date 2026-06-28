import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Credenciales de Supabase (service role) no configuradas");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      // Fuerza que los fetch internos del SDK no usen el caché de Next.js.
      // Sin esto, Next.js cachea los requests de Supabase con force-cache y las
      // páginas ISR sirven datos congelados aunque el timer de revalidación expire.
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
