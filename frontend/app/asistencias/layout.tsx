// app/asistencias/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AsistenciasLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const usuarioId = cookieStore.get("usuario_id")?.value;

  if (!usuarioId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-700">
              Sistema de Asistencias
            </h1>
            <nav className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/asistencias"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Lista General
              </Link>
              <Link
                href="/asistencias/lote"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Registrar por Lote
              </Link>
              <Link
                href="/asistencias/historial"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Historial
              </Link>
              <Link
                href="/asistencias/semanal"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Asistencia Semanal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </main>
    </div>
  );
}