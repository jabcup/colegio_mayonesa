import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function NotificacionesDocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const usuarioId = cookieStore.get("usuario_id")?.value;

  // Puedes agregar más validaciones aquí, ej: rol de "docente"
  if (!usuarioId) {
    redirect("/"); // o a /login si tienes una página dedicada
  }

  return <>{children}</>;
}