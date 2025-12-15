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

//   Encabezados de Columnas y Filas
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];


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

interface Props {
  idEstudiante: number;
}

export default function TableHorario({ idEstudiante }: Props) {
  const [mapa, setMapa] = useState<Record<string, Record<string, Asignacion>>>(
    {}
  );
  const [horarios, setHorarios] = useState<string[]>([]);
  const ordenarHorarios = (a: string, b: string) => {
    const [horaA] = a.split(" - ");
    const [horaB] = b.split(" - ");

    return horaA.localeCompare(horaB);
  };
  useEffect(() => {
    if (!idEstudiante) return;

    const fetchHorario = async () => {
      try {
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

        const horariosOrdenados =
          Array.from(setHorariosUnicos).sort(ordenarHorarios);

        setMapa(tempMapa);
        setHorarios(horariosOrdenados);
      } catch (error) {
        console.error("Error cargando horario académico", error);
      }
    };

    fetchHorario();
  }, [idEstudiante]);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
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

                return (
                  <TableCell key={dia} align="center">
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
  );
}
