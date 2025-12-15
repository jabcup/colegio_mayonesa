import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ await porque cookies() devuelve Promise
  const cookieStore = await cookies();
  const usuarioId = cookieStore.get("usuario_id")?.value;

  if (!usuarioId) {
    redirect("/");
  }

  return <>{children}</>;
}