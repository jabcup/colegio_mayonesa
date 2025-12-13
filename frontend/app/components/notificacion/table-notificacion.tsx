"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion?: string;
}

interface Notificacion {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
  Estudiante: Estudiante;
}

export default function TableNotificaciones() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingEst, setLoadingEst] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoadingEst(true);
    try {
      const res = await api.get("/estudiante/MostrarEstudiantes");
      setEstudiantes(res.data);
    } catch (err) {
      alert("Error al cargar estudiantes");
    } finally {
      setLoadingEst(false);
    }
  };

  const cargarNotificaciones = async () => {
    if (!selectedEstudiante) return;

    setLoadingNotif(true);
    try {
      const res = await api.get(`/notificaciones/Estudiante/${selectedEstudiante.id}`);
      let data = res.data as Notificacion[];

      // Ordenar por fecha (más reciente primero por defecto)
      data = data.sort((a, b) =>
        sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      );

      setNotificaciones(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar notificaciones");
      setNotificaciones([]);
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [selectedEstudiante]);

  const toggleSort = () => {
    setSortDesc(!sortDesc);
    setNotificaciones((prev) =>
      [...prev].sort((a, b) =>
        !sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      )
    );
  };

  const formatoFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNombreCompleto = (est: Estudiante) =>
    `${est.nombres} ${est.apellidoPat} ${est.apellidoMat}`;

  const getOptionLabel = (option: Estudiante) =>
    `${getNombreCompleto(option)} ${option.identificacion ? `- ${option.identificacion}` : ""}`;

  return (
    <Box sx={{ mt: 4 }}>
      <Autocomplete
        options={estudiantes}
        getOptionLabel={getOptionLabel}
        value={selectedEstudiante}
        onChange={(_event, newValue) => setSelectedEstudiante(newValue)}
        loading={loadingEst}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar estudiante por nombre o identificación"
            placeholder="Escribe para buscar..."
            fullWidth
            sx={{ maxWidth: 500 }}
          />
        )}
        noOptionsText="No se encontraron estudiantes"
      />

      {selectedEstudiante && (
        <>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6">
              Notificaciones de: <strong>{getNombreCompleto(selectedEstudiante)}</strong>
            </Typography>
            <Button variant="outlined" onClick={toggleSort} sx={{ mt: 1 }}>
              Ordenar por fecha: {sortDesc ? "Más reciente primero" : "Más antiguo primero"}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Estudiante</strong></TableCell>
                  <TableCell><strong>Asunto</strong></TableCell>
                  <TableCell><strong>Mensaje</strong></TableCell>
                  <TableCell><strong>Fecha Envío</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingNotif ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : notificaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>No hay notificaciones para este estudiante.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  notificaciones.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell>{getNombreCompleto(notif.Estudiante)}</TableCell>
                      <TableCell>{notif.asunto}</TableCell>
                      <TableCell>{notif.mensaje}</TableCell>
                      <TableCell>{formatoFecha(notif.fecha_creacion)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}