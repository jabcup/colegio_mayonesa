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
  const estudianteId = cookieStore.get("usuario_id")?.value;

  if (!estudianteId) {
    redirect("/");
  }

  return <>{children}</>;
}
