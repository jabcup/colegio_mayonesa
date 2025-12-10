"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion: string;
  correo: string;
  correo_institucional: string;
  rude: string;
  direccion: string;
  telefono_referencia: string;
  fecha_nacimiento: string;
  sexo: string;
  nacionalidad: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  estudiantes: Estudiante[];
}

export default function TableEstudiante({ estudiantes }: Props) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nombre Completo</strong></TableCell>
            <TableCell><strong>CI</strong></TableCell>
            <TableCell><strong>Correo</strong></TableCell>
            <TableCell><strong>Correo Institucional</strong></TableCell>
            <TableCell><strong>RUDE</strong></TableCell>
            <TableCell><strong>Dirección</strong></TableCell>
            <TableCell><strong>Tel. Referencia</strong></TableCell>
            <TableCell><strong>Sexo</strong></TableCell>
            <TableCell><strong>Nacionalidad</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(estudiantes ?? []).map((e, index) => (
            <TableRow key={index}>
              <TableCell>{e.nombres} {e.apellidoPat} {e.apellidoMat}</TableCell>
              <TableCell>{e.identificacion}</TableCell>
              <TableCell>{e.correo}</TableCell>
              <TableCell>{e.correo_institucional}</TableCell>
              <TableCell>{e.rude}</TableCell>
              <TableCell>{e.direccion}</TableCell>
              <TableCell>{e.telefono_referencia}</TableCell>
              <TableCell>{e.sexo}</TableCell>
              <TableCell>{e.nacionalidad}</TableCell>
              <TableCell>{e.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
