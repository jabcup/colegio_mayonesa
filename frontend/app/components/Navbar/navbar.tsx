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
            label="Calificaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/calificacion")}
          />
          <Boton
            label="Reportes"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/reporte")}
          />
          <Boton
            label="Asistencias"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/asistencias")}
          />

          <Boton
            label="Personal"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/personal")}
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
          <Boton
            label="Notificaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/notificaciones")}
          />
          <Boton
            label="Roles"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/rol")}
          />
          <Boton
            label="Asignaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/asignacion")}
          />
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
