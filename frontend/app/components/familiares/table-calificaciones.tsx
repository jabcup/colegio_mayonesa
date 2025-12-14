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
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

/* =======================
   Interfaces
======================= */

interface Calificacion {
  id: number;
  materia: {
    id: number;
    nombre: string;
    fechaCreacion: string;
  };
  calificacion: string;
  fecha_creacion: string;
}

interface FilaMateria {
  materia: string;
  t1: number;
  t2: number;
  t3: number;
  promedio: number;
}

interface Props {
  idEstudiante: number;
}

/* =======================
   Componente
======================= */

export default function TableCalificaciones({ idEstudiante }: Props) {
  const [rows, setRows] = useState<FilaMateria[]>([]);

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchCalificaciones = async () => {
      try {
        const res = await api.get(
          `/calificaciones/GestionActual/${idEstudiante}`
        );

        const calificaciones: Calificacion[] = res.data.calificaciones;

        /* Agrupar por materia */
        const agrupadas: Record<number, Calificacion[]> = {};

        calificaciones.forEach((c) => {
          if (!agrupadas[c.materia.id]) {
            agrupadas[c.materia.id] = [];
          }
          agrupadas[c.materia.id].push(c);
        });

        /* Transformar a filas */
        const filas: FilaMateria[] = Object.values(agrupadas).map(
          (listaMateria) => {
            const ordenadas = listaMateria.sort(
              (a, b) =>
                new Date(a.fecha_creacion).getTime() -
                new Date(b.fecha_creacion).getTime()
            );

            const t1 = Number(ordenadas[0]?.calificacion ?? 0);
            const t2 = Number(ordenadas[1]?.calificacion ?? 0);
            const t3 = Number(ordenadas[2]?.calificacion ?? 0);

            const promedio = Number(((t1 + t2 + t3) / 3).toFixed(2));

            return {
              materia: listaMateria[0].materia.nombre,
              t1,
              t2,
              t3,
              promedio,
            };
          }
        );

        setRows(filas);
      } catch (error) {
        console.error("Error cargando calificaciones", error);
      }
    };

    fetchCalificaciones();
  }, [idEstudiante]); // 👈 importante

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Calificaciones
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Materia</strong></TableCell>
            <TableCell align="center"><strong>1er Trimestre</strong></TableCell>
            <TableCell align="center"><strong>2do Trimestre</strong></TableCell>
            <TableCell align="center"><strong>3er Trimestre</strong></TableCell>
            <TableCell align="center"><strong>Promedio Anual</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.materia}</TableCell>
              <TableCell align="center">{row.t1}</TableCell>
              <TableCell align="center">{row.t2}</TableCell>
              <TableCell align="center">{row.t3}</TableCell>
              <TableCell align="center">
                <strong>{row.promedio}</strong>
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No existen calificaciones registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
