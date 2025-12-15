"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";
import { getAuthData } from "@/app/lib/auth";

export default function Navbar() {
  const { rol } = getAuthData();
  console.log(rol);

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
          {rol !== "Secretaria-o" && rol !== "Cajero" && (
          <Boton
            label="Calificaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/calificacion")}
          />
          )}
          <Boton
            label="Reportes"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/reporte")}
          />
          {rol !== "Secretaria-o" && rol !== "Cajero" && (
          <Boton
            label="Asistencias"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/asistencias")}
          />
          )}
          {rol !== "Cajero" && rol!== "Docente" && (
          <Boton
            label="Personal"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/personal")}
          />
          )}
          {rol !== "Cajero" && rol!== "Docente" && (
          <Boton
            label="Materias"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/materias")}
          />
          )}
          {rol !== "Cajero" && rol!== "Docente" &&  (
          <Boton
            label="Horarios"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/horarios")}
          />
          )}
          {rol !== "Secretaria-o" && rol!== "Docente" &&  (
          <Boton
            label="Pagos"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/pago")}
          />
          )}
          {rol !== "Docente" && (
          <Boton
            label="Notificaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/notificaciones")}
          />
          )}
          {rol !== "Cajero" && rol!== "Docente" &&  (
          <Boton
            label="Roles"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/rol")}
          />
          )}
          {rol !== "Cajero" && (
          <Boton
            label="Asignaciones"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/asignacion")}
          />
          )}
          <Boton
            label="Cursos"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/cursos")}
          />
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
