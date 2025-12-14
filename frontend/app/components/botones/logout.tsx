"use client";

import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ Borra las cookies usadas en el layout
    Cookies.remove("usuario_id", { path: "/" });
    Cookies.remove("usuario_correo", { path: "/" });

    // 🔄 Redirige al login
    router.replace("/");
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
}
