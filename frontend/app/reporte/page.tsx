"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Typography, Box, Grid, Card, CardContent, Stack } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import { useState } from "react";
import FormFiltrosReporte from "../components/reporte/form-filtros-reporte";
import { getAuthData } from "../lib/auth";
import { Boton } from "../components/botones/botonNav";

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

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Centro de Reportes
        </Typography>
        <Typography align="center" color="text.secondary" mb={4}>
          Selecciona el tipo de reporte que deseas generar
        </Typography>

        <Grid container spacing={3}>
          {rol !== "Cajero" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <SchoolIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Calificaciones por Curso
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("calificacionesCurso")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Cajero" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <AssessmentIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Calificaciones por Estudiante
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("calificacionesEstudiante")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Cajero" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <EventAvailableIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Asistencias por Curso
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("asistenciasCurso")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Cajero" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <EventAvailableIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Asistencias por Estudiante
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("asistenciasEstudiante")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Docente" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <PaymentsIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Pagos por Curso
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("pagosCurso")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Docente" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <PaymentsIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Pagos por Estudiante
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("pagosEstudiante")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Cajero" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <GroupIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Estudiantes por Curso
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("listadoEstudiantes")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {rol !== "Cajero" && rol !== "Docente" && (
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <SupervisorAccountIcon color="success" fontSize="large" />
                    <Typography fontWeight="bold">
                      Tutores por Curso
                    </Typography>
                    <Boton
                      label="Descargar"
                      color="success"
                      size="small"
                      onClick={() => handleOpenFiltro("tutoresCurso")}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>

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
