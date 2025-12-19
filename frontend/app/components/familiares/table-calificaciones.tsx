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

interface Calificacion {
  id: number;
  materia: {
    id: number;
    nombre: string;
  };
  trim1: string | null;
  trim2: string | null;
  trim3: string | null;
}

interface Props {
  idEstudiante: number;
}

export default function TableCalificaciones({ idEstudiante }: Props) {
  const [rows, setRows] = useState<Calificacion[]>([]);

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchCalificaciones = async () => {
      try {
        const res = await api.get(
          `/calificaciones/GestionActual/${idEstudiante}`
        );

        console.log("Respuesta API:", res.data);

        setRows(res.data.calificaciones ?? []);
      } catch (error) {
        console.error("Error cargando calificaciones", error);
        setRows([]);
      }
    };

    fetchCalificaciones();
  }, [idEstudiante]);
  const calcularFinal = (
    t1: string | null,
    t2: string | null,
    t3: string | null
  ): number | null => {
    const notas = [t1, t2, t3]
      .map((n) => (n !== null ? Number(n) : null))
      .filter((n): n is number => !isNaN(n as number));

    if (notas.length === 0) return null;

    const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
    return Number(promedio.toFixed(2));
  };

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
              <strong>Primer Trimestre</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Segundo Trimestre</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Tercer Trimestre</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Nota Final</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Estado</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const final = calcularFinal(row.trim1, row.trim2, row.trim3);
            const aprobado = final !== null && final >= 51;

            return (
              <TableRow key={row.id}>
                <TableCell>{row.materia.nombre}</TableCell>

                <TableCell align="center">{row.trim1 ?? "-"}</TableCell>
                <TableCell align="center">{row.trim2 ?? "-"}</TableCell>
                <TableCell align="center">{row.trim3 ?? "-"}</TableCell>

                <TableCell align="center">
                  <strong>{final ?? "-"}</strong>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: aprobado ? "#C8E6C9" : "#FFCDD2",
                  }}
                >
                  <strong>
                    {final === null
                      ? "Sin nota"
                      : aprobado
                      ? "Aprobado"
                      : "Reprobado"}
                  </strong>
                </TableCell>
              </TableRow>
            );
          })}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No existen calificaciones registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
