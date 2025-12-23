// components/botones/logout.tsx
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "../../css/LogoutNutton.module.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Eliminar todas las cookies
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

  return (
    <button className="logout-button" onClick={handleLogout}>
      <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="logout-text">Salir</span>
    </button>
  );
}