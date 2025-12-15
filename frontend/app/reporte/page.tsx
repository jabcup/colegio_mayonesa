"use client";

import Navbar from "@/app/components/Navbar/navbar";

import { Button, Typography } from "@mui/material";

import { useState } from "react";

import FormFiltrosReporte from "../components/reporte/form-filtros-reporte";

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

      {/* Solo recibe filtro de idCuro */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("calificacionesCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Calificaciones por Curso
      </Button>

      {/* Solo recibe filtro de idEstudiante */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("calificacionesEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Calificaciones por Estudiante
      </Button>

      {/* Solo recibe filtro de idCuro y mes como 12 */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("asistenciasCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Asistencias por Curso
      </Button>

      {/* Solo recibe filtro de idEstudiante */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("asistenciasEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Asistencias por Estudiante
      </Button>

      {/* Solo recibe filtro de idCuro, estado como 'pendiente', mes como 12 y año como 2025 */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("pagosCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Pagos por Curso
      </Button>

      {/* Solo recibe filtro de idEstudiante */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("pagosEstudiante")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Pagos por Estudiante
      </Button>

      {/* Solo recibe filtro de idCuro */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("listadoEstudiantes")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Listado de Estudiantes de un Curso
      </Button>

      {/* Este reporte es el unico que no recibe filtros */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenFiltro("tutoresCurso")}
        sx={{ mb: 2 }}
      >
        Descargar Reporte Tutores por Curso
      </Button>

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
