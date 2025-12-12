"use client";

import Navbar from "@/app/components/Navbar/navbar";

import {
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

import FormFiltrosReporte from "../components/reporte/form-filtros-reporte";

export default function ReportePage() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {}, []);
  
  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Página de Reportes
      </Typography>

      <Button 
        variant="contained"
        color="primary"
        onClick={() => setShowForm(true)}
        sx={ { mb: 2} }
      >
        Descargar Reporte Calificaciones por Curso
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Calificaciones por Estudiante
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Asistencias por Curso
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Asistencias por Estudiante
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Pagos por Curso
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Pagos por Estudiante
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Listado de Estudiantes de un Curso
      </Button>

      <Button variant="contained" color="primary">
        Descargar Reporte Tutores por Curso
      </Button>

      <FormFiltrosReporte
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
