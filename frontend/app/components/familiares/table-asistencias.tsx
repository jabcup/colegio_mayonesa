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
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

/* ---------------- CONSTANTES ---------------- */

const DIAS_SEMANA = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"] as const;

const COLORES_ASISTENCIA = {
  presente: "#C8E6C9",
  falta: "#FFCDD2",
  justificativo: "#FFF9C4",
  ausente: "#E1BEE7",
} as const;

type EstadoAsistencia = keyof typeof COLORES_ASISTENCIA;

/* ---------------- INTERFACES ---------------- */

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
  asistencia: string;
  asignacionClase: {
    id: number;
  };
}

interface Props {
  idEstudiante: number;
}

/* ---------------- COMPONENTE ---------------- */

export default function TableAsistencia({ idEstudiante }: Props) {
  console.log(idEstudiante);
  const [mapa, setMapa] = useState<Record<string, Record<string, Asignacion>>>(
    {}
  );
  const [horarios, setHorarios] = useState<string[]>([]);
  const [asistenciasMap, setAsistenciasMap] = useState<
    Record<number, EstadoAsistencia>
  >({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Dayjs>(dayjs());

  /* ----------- ORDENAR HORARIOS ----------- */

  const ordenarHorarios = (a: string, b: string) => {
    const [horaA] = a.split(" - ");
    const [horaB] = b.split(" - ");
    return horaA.localeCompare(horaB);
  };

  /* ----------- FETCH HORARIO ----------- */

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchHorario = async () => {
      try {
        const res = await api.get(
          `/asignacion-clases/estudiante/${idEstudiante}`
        );

        const asignaciones: Asignacion[] = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? [];

        const tempMapa: Record<string, Record<string, Asignacion>> = {};
        const horariosUnicos = new Set<string>();

        asignaciones.forEach((a) => {
          const h = a.horario.horario;
          const d = a.dia;

          horariosUnicos.add(h);

          if (!tempMapa[h]) tempMapa[h] = {};
          tempMapa[h][d] = a;
        });

        setMapa(tempMapa);
        setHorarios(Array.from(horariosUnicos).sort(ordenarHorarios));
      } catch (error) {
        console.error("Error al obtener horario", error);
      }
    };

    fetchHorario();
  }, [idEstudiante]);

  /* ----------- FETCH ASISTENCIAS ----------- */

  useEffect(() => {
    if (!idEstudiante || !fechaSeleccionada) return;

    const fetchAsistencias = async () => {
      try {
        const fecha = fechaSeleccionada.format("YYYY-MM-DD");

        console.log(fecha);

        const res = await api.get(
          `/asistencias/asistenciaSemanal/${idEstudiante}/${fecha}`
        );

        console.log(res.data);

        const asistencias: Asistencia[] = Array.isArray(res.data)
          ? res.data
          : res.data.data ?? [];

        const map: Record<number, EstadoAsistencia> = {};

        asistencias.forEach((a) => {
          const estado = a.asistencia?.toLowerCase();
          


          if (estado in COLORES_ASISTENCIA) {
            map[a.asignacionClase.id] = estado as EstadoAsistencia;
          }
        });

        setAsistenciasMap(map);
      } catch (error) {
        console.error("Error al obtener asistencias", error);
      }
    };

    fetchAsistencias();
  }, [idEstudiante, fechaSeleccionada]);

  /* ---------------- RENDER ---------------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ width: "95%", mx: "auto" }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Horario Académico
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {Object.entries(COLORES_ASISTENCIA).map(([estado, color]) => (
                <Box
                  key={estado}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 14,
                      backgroundColor: color,
                      borderRadius: 0.5,
                      border: "1px solid #ccc",
                    }}
                  />
                  <Typography variant="body2">
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ width: 260 }}>
            <DatePicker
              label="Semana de referencia"
              value={fechaSeleccionada}
              onChange={(newValue) =>
                newValue && setFechaSeleccionada(newValue)
              }
              disableFuture
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </Box>
        </Box>

        {/* TABLA */}
        <TableContainer component={Paper}>
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
                          backgroundColor:
                            asistencia &&
                            COLORES_ASISTENCIA[asistencia]
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
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
