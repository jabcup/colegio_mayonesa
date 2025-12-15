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
  nota: number;
  aprobado: boolean;
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

            const nota = Number(ordenadas[0]?.calificacion ?? 0);

            const aprobado = nota >= 51;

            return {
              materia: listaMateria[0].materia.nombre,
              nota,
              aprobado,
            };
          }
        );

        setRows(filas);
      } catch (error) {
        console.error("Error cargando calificaciones", error);
      }
    };

    fetchCalificaciones();
  }, [idEstudiante]);
  useEffect(() => {console.log(rows);
  }, [rows]);

  return (
    <TableContainer component={Paper} sx={{ mt: 3, width: "95%", mx: "auto" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Calificaciones
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Materia</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Nota</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Estado</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.materia}</TableCell>
              <TableCell align="center">{row.nota}</TableCell>
              <TableCell align="center" sx={{ backgroundColor: row.aprobado ? "#C8E6C9" : "#FFCDD2"}}>
                <strong>{row.aprobado && "Aprobado" || "Reprobado"}</strong>
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
