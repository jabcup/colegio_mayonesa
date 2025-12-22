// app/estudiante/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const usuarioId = Cookies.get("usuario_id");
      const usuarioRol = Cookies.get("usuario_rol");

      // Roles permitidos
      const rolesPermitidos = ["Administrador", "Docente", "Secretario", "Cajero", "cajero"];

      if (!usuarioId || !usuarioRol) {
        // Limpiar cookies y redirigir
        clearCookiesAndRedirect();
        return;
      }

      // Verificar si el rol está permitido
      if (!rolesPermitidos.includes(usuarioRol)) {
        clearCookiesAndRedirect();
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const clearCookiesAndRedirect = () => {
    // Limpiar todas las cookies
    Cookies.remove("usuario_id");
    Cookies.remove("usuario_correo");
    Cookies.remove("usuario_rol");
    Cookies.remove("personal_id");
    Cookies.remove("access_token");
    Cookies.remove("estudiante_id");
    Cookies.remove("estudiante_correo");
    
    // Redirigir al login
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Ya redirigió en el useEffect
  }

  return <>{children}</>;
}