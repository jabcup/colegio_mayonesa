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
  Button,
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
  onEdit: (calificacion: CalificacionFiltrada) => void;
  onDelete: (id: number) => void;
}


export default function TableCalificacion({ calificaciones, onEdit, onDelete }: Props) {
  
  return (
    <>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Aprobación</TableCell>
              <TableCell>Acciones</TableCell>
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
                <TableCell>
                  <Button
                    variant="outlined" 
                    onClick={() => onEdit(c)}
                  >
                    Editar
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(c.id)}
                  >
                    Eliminar
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
