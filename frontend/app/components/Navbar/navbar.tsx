"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";
import { getAuthData } from "@/app/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const auth = getAuthData();
  const rol = auth?.rol;

  if (!rol) {
    return null;
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Colegio Mayo - Sección Administrativa
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
          {rol !== "Cajero" && rol !== "Docente" && (
            <Boton
              label="Personal"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/personal")}
            />
          )}
          {rol !== "Cajero" && rol !== "Docente" && (
            <Boton
              label="Materias"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/materias")}
            />
          )}
          {rol !== "Cajero" && rol !== "Docente" && (
            <Boton
              label="Horarios"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/horarios")}
            />
          )}
          {rol !== "Secretaria-o" && rol !== "Docente" && (
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
          {rol !== "Docente" && (
            <Boton
              label="Avisos"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/avisos")}
            />
          )}
          {rol !== "Cajero" && rol !== "Docente" && (
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
          {rol !== "Cajero" && rol !== "Docente" && (
            <Boton
              label="Cursos"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/cursos")}
            />
          )}
          {rol === "Administrador" && (
            <Boton
              label="Auditoria"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/auditoria")}
            />
          )}
          {rol !== "Cajero" && rol !== "Docente" && (
            <Boton
              label="Tutores"
              color="success"
              size="small"
              className="ml-2"
              onClick={() => router.push("/tutor")}
            />
          )}
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
