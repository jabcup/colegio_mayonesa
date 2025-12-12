"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  MenuItem,
  TextField,
} from "@mui/material";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface CalificacionFiltrada {
  id: number;
  calificacion: number;
  aprobacion: boolean;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
}

interface Props {
  calificaciones: CalificacionFiltrada[];
}


export default function TableCalificacion({ calificaciones }: Props) {
  
  return (
    <>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Aprobación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calificaciones.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.estudiante.nombres} {c.estudiante.apellidoPat}{" "}
                  {c.estudiante.apellidoMat}
                </TableCell>
                <TableCell>{c.calificacion}</TableCell>
                <TableCell>{c.aprobacion ? "Aprobado" : "Reprobado"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
