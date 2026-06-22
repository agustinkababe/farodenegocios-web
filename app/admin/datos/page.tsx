import { notFound } from "next/navigation";
import AdminDatosClient from "./AdminDatosClient";

// TODO: Reemplazar este chequeo de secret por un sistema de auth real antes de producción
export default async function AdminDatosPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || secret !== adminSecret) {
    return notFound();
  }

  return <AdminDatosClient secret={secret} />;
}
