"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Boton } from "./botonNav";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Borra las cookies usadas en el layout
    Cookies.remove("usuario_id", { path: "/" });
    Cookies.remove("usuario_correo", { path: "/" });
    Cookies.remove("usuario_rol", { path: "/" });
    Cookies.remove("personal_id", { path: "/" });

    // Redirige al login
    router.replace("/");
  };

  return (
    <Boton label="Cerrar Sesión" color="error" size= "small" className="ml-2" onClick={handleLogout} />
  );
}
