import { notFound } from "next/navigation";
import ArticulosAdminClient from "./ArticulosAdminClient";

// TODO: Reemplazar este chequeo de secret por un sistema de auth real antes de producción.
export default async function AdminArticulosPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return notFound();
  }

  return <ArticulosAdminClient secret={secret} />;
}
