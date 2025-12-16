"use client";
import { useEffect, useState } from "react";
import NavbarFamiliares from "../components/Navbar/navbar-familiares";
import TableCalificaciones from "../components/familiares/table-calificaciones";
import TableHorario from "../components/familiares/table-horario";
import { api } from "../lib/api";
import TableAsistencia from "../components/familiares/table-asistencias";
import Cookies from "js-cookie";
import { Typography } from "@mui/material";
import TablePagosEstudiante from "../components/familiares/table-pagos";
import TableNotificacionesEstudiante from "../components/familiares/table-notificaciones";

export interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion: string;
  correo_institucional: string;
}

export default function FamiliaresPage() {
  const [vista, setVista] = useState<string>("calificaciones");
  const [estudiante, setEstudiante] = useState<Estudiante>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Cookies.get("estudiante_id");
        const res = await api.get(`/estudiante/MostrarEstudiante/${id}`);
        setEstudiante(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <NavbarFamiliares
        onChangeVista={setVista}
        nombreEstudiante={
          estudiante
            ? `Est. ${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat}`
            : undefined
        }
      />
      {vista === "calificaciones" && estudiante && (
        <TableCalificaciones idEstudiante={estudiante.id} />
      )}
      {vista === "horarios" && estudiante && (
        <TableHorario idEstudiante={estudiante.id} />
      )}
      {vista === "asistencias" && estudiante && (
        <TableAsistencia idEstudiante={estudiante.id} />
      )}
      {vista === "pagos" && estudiante && (
        <TablePagosEstudiante idEstudiante={estudiante.id} />
      )}
      {vista === "notificaciones" && estudiante && (
        <TableNotificacionesEstudiante idEstudiante={estudiante.id} />
      )}
    </>
  );
}
