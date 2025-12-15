"use client";

import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Boton } from "./botonNav";

export default function LogoutButtonEst() {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ Borra las cookies usadas en el layout
    Cookies.remove("estudiante_id", { path: "/" });
    Cookies.remove("estudiante_correo", { path: "/" });

    // 🔄 Redirige al login
    router.replace("/login");
  };
  return (
    <Boton label="Cerrar Sesión" color="error" size= "small" className="ml-2" onClick={handleLogout} />
  );
}
