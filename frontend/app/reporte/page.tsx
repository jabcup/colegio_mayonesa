"use client";

import Navbar from "@/app/components/Navbar/navbar";

import { Button, Typography } from "@mui/material";

import { useState } from "react";

import FormFiltrosReporte from "../components/reporte/form-filtros-reporte";

import { getAuthData } from "../lib/auth";

type TipoReporte =
  | "calificacionesCurso"
  | "calificacionesEstudiante"
  | "asistenciasCurso"
  | "asistenciasEstudiante"
  | "pagosCurso"
  | "pagosEstudiante"
  | "listadoEstudiantes"
  | "tutoresCurso";

export default function ReportePage() {
  const [showForm, setShowForm] = useState(false);
  const [tipoReporte, setTipoReporte] = useState<TipoReporte | null>(null);

  const { rol } = getAuthData();

  const handleOpenFiltro = (reporte: TipoReporte) => {
    setTipoReporte(reporte);
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Página de Reportes
      </Typography>

      {rol !== "Cajero" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("calificacionesCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Calificaciones por Curso
      </Button>
      )}

      {rol !== "Cajero" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("calificacionesEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Calificaciones por Estudiante
      </Button>
      )}

      {rol !== "Cajero" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("asistenciasCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Asistencias por Curso
      </Button>
      )}

      {rol !== "Cajero" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("asistenciasEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Asistencias por Estudiante
      </Button>
      )}

      {rol !== "Docente" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("pagosCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Pagos por Curso
      </Button>
      )}

      {rol !== "Docente" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("pagosEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Pagos por Estudiante
      </Button>
      )}

      {rol !== "Cajero" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("listadoEstudiantes")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Listado de Estudiantes de un Curso
      </Button>
      )}

      {rol !== "Cajero" && rol !== "Docente" && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("tutoresCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Tutores por Curso
      </Button>
      )}

      {tipoReporte && (
        <FormFiltrosReporte
          open={showForm}
          onClose={() => setShowForm(false)}
          tipoReporte={tipoReporte}
        />
      )}
    </>
  );
}
