"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es"; // idioma espaniol chaval
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const COLORES_ASISTENCIA: Record<string, string> = {
  presente: "#C8E6C9",
  falta: "#FFCDD2",
  justificativo: "#FFF9C4",
  ausente: "#E1BEE7",
};

interface Asignacion {
  id: number;
  dia: string;
  materia: {
    nombre: string;
  };
  personal: {
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  horario: {
    horario: string;
  };
}

interface Asistencia {
  asistencia: "presente" | "falta" | "justificativo" | "ausente";
  asignacionClase: {
    id: number;
  };
}

interface Props {
  idEstudiante: number;
}

export default function TableAsistencia({ idEstudiante }: Props) {
  const [mapa, setMapa] = useState<Record<string, Record<string, Asignacion>>>(
    {}
  );
  const [horarios, setHorarios] = useState<string[]>([]);
  const [asistenciasMap, setAsistenciasMap] = useState<Record<number, string>>(
    {}
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Dayjs>(dayjs());

  const ordenarHorarios = (a: string, b: string) => {
    const [horaA] = a.split(" - ");
    const [horaB] = b.split(" - ");
    return horaA.localeCompare(horaB);
  };

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchHorario = async () => {
      const res = await api.get(
        `/asignacion-clases/estudiante/${idEstudiante}`
      );

      const asignaciones: Asignacion[] = res.data;

      const tempMapa: Record<string, Record<string, Asignacion>> = {};
      const setHorariosUnicos = new Set<string>();

      asignaciones.forEach((a) => {
        const h = a.horario.horario;
        const d = a.dia;

        setHorariosUnicos.add(h);

        if (!tempMapa[h]) tempMapa[h] = {};
        tempMapa[h][d] = a;
      });

      setMapa(tempMapa);
      setHorarios(Array.from(setHorariosUnicos).sort(ordenarHorarios));
    };

    fetchHorario();
  }, [idEstudiante]);

  useEffect(() => {
    if (!idEstudiante || !fechaSeleccionada) return;

    const fetchAsistencias = async () => {
      const fecha = fechaSeleccionada.format("YYYY-MM-DD");

      const res = await api.get(
        `/asistencias/asistenciaSemanal/${idEstudiante}/${fecha}`
      );

      const asistencias: Asistencia[] = res.data;

      const map: Record<number, string> = {};
      asistencias.forEach((a) => {
        map[a.asignacionClase.id] = a.asistencia;
      });

      setAsistenciasMap(map);
    };

    fetchAsistencias();
  }, [idEstudiante, fechaSeleccionada]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        {/* Selector de fecha */}
        <Box sx={{ mb: 2, maxWidth: 250 }}>
          <DatePicker
            label="Semana de referencia"
            value={fechaSeleccionada}
            onChange={(newValue) => {
              if (newValue) setFechaSeleccionada(newValue);
            }}
            disableFuture
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>

        <TableContainer component={Paper}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Horario Académico
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Horario</strong>
                </TableCell>
                {DIAS_SEMANA.map((dia) => (
                  <TableCell key={dia} align="center">
                    <strong>{dia}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {horarios.map((horario) => (
                <TableRow key={horario}>
                  <TableCell>
                    <strong>{horario}</strong>
                  </TableCell>

                  {DIAS_SEMANA.map((dia) => {
                    const asignacion = mapa[horario]?.[dia];
                    const asistencia =
                      asignacion && asistenciasMap[asignacion.id];

                    return (
                      <TableCell
                        key={dia}
                        align="center"
                        sx={{
                          backgroundColor: asistencia
                            ? COLORES_ASISTENCIA[asistencia]
                            : "transparent",
                        }}
                      >
                        {asignacion ? (
                          <Box>
                            <Typography fontWeight="bold">
                              {asignacion.materia.nombre}
                            </Typography>
                            <Typography variant="body2">
                              {asignacion.personal.nombres}{" "}
                              {asignacion.personal.apellidoPat}{" "}
                              {asignacion.personal.apellidoMat}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin asignar
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
}
