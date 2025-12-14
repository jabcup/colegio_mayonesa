"use client";

import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Cerrar acceso Familiar
    </Button>
  );
}
