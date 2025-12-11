"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

interface EstudianteFull {
  id: number;
  estudiante: {
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
  };
  tutor: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    telefono: string;
    estado: string;
  };
  relacion: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  estudiantes: EstudianteFull[];
}

export default function TableEstudiante({ estudiantes }: Props) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Nombre Completo</strong></TableCell>
            <TableCell><strong>CI</strong></TableCell>
            <TableCell><strong>Correo</strong></TableCell>
            <TableCell><strong>Tutor</strong></TableCell>
            <TableCell><strong>Estado Estudiante</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
            <TableCell><strong>Ver Más</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {estudiantes.map((e) => {
            const fullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat}`;
            const tutorName = `${e.tutor.nombres} ${e.tutor.apellidoPat} ${e.tutor.apellidoMat}`;

            return (
              <>
                <TableRow key={e.id}>
                  <TableCell>
                    {e.id}
                  </TableCell>
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{e.estudiante.identificacion}</TableCell>
                  <TableCell>{e.estudiante.correo}</TableCell>
                  <TableCell>{tutorName}</TableCell>
                  <TableCell>{e.estudiante.estado}</TableCell>
                  <TableCell><Button>Editar</Button><Button color="error">Eliminar</Button></TableCell>
                  <IconButton
                      size="small"
                      onClick={() => setOpenRow(openRow === e.id ? null : e.id)}
                    >
                      {openRow === e.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton> 
                </TableRow>

                {/* Fila expandible */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRow === e.id} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="subtitle2">Información completa:</Typography>
                        <Typography><b>Correo Institucional:</b> {e.estudiante.correo_institucional}</Typography>
                        <Typography><b>RUDE:</b> {e.estudiante.rude}</Typography>
                        <Typography><b>Dirección:</b> {e.estudiante.direccion}</Typography>
                        <Typography><b>Teléfono de Referencia:</b> {e.estudiante.telefono_referencia}</Typography>
                        <Typography><b>Fecha de Nacimiento:</b> {e.estudiante.fecha_nacimiento}</Typography>
                        <Typography><b>Sexo:</b> {e.estudiante.sexo}</Typography>
                        <Typography><b>Nacionalidad:</b> {e.estudiante.nacionalidad}</Typography>
                        <Typography><b>Relación con Tutor:</b> {e.relacion}</Typography>
                        <Typography><b>Fecha de Creación:</b> {e.fecha_creacion}</Typography>
                        <Typography><b>Nombre del Tutor:</b> {tutorName} <Button>Editar</Button> <Button color="error">Eliminar</Button> </Typography>

                        <Typography><b>Telefono del Tutor:</b> {e.tutor.telefono}</Typography>
                        <Typography><b>Estado del Tutor:</b> {e.tutor.estado}</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
