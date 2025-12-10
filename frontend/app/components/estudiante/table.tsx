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
  relacion: string;
  padre: {
    id: number;
    nombres: string;
    apellidoPat: string;
    telefono: string;
  };
  curso: {
    id: number;
    nombre: string;
    paralelo: string;
  };
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
            <TableCell><strong>RUDE</strong></TableCell>
            <TableCell><strong>Curso</strong></TableCell>
            <TableCell><strong>Padre/Tutor</strong></TableCell>
            <TableCell><strong>Tel. Referencia</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {estudiantes.map((e, index) => (
            <TableRow key={index}>
              <TableCell>
                {e.nombres} {e.apellidoPat} {e.apellidoMat}
              </TableCell>

              <TableCell>{e.identificacion}</TableCell>

              <TableCell>
                {e.correo} <br /> {e.correo_institucional}
              </TableCell>

              <TableCell>{e.rude}</TableCell>

              <TableCell>
                {e.curso.nombre} — {e.curso.paralelo}
              </TableCell>

              <TableCell>
                {e.padre.nombres} {e.padre.apellidoPat} <br />
                <small>📞 {e.padre.telefono}</small>
              </TableCell>

              <TableCell>{e.telefono_referencia}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
