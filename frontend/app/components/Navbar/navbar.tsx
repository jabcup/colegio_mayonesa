"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";

export default function Navbar() {
  const router = useRouter();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mayonesa
          </Typography>
          <Boton
            label="Estudiantes"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/estudiante")}
          />
          <Boton
            label="Materias"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/materias")}
          />
          <Boton
            label="Horarios"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/horarios")}
          />
          <Boton
            label="Pagos"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/pago")}
          />
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
