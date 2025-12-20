"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import { Boton } from "../botones/botonNav";

export interface Tutor {
  id: number;
  personal: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  curso: {
    id: number;
    nombre: string;
    paralelo: {
      id: number;
      nombre: string;
    };
    gestion: number;
  };
}

interface Props {
  tutores: Tutor[];
  onEdit: (tutor: Tutor) => void;
  onDelete: (id: number) => void;
}

export default function TablaTutores({ tutores, onEdit, onDelete }: Props) {

  const conflictos: Record<string, number> = {};

  tutores.forEach((t) => {
    const key = `${t.personal.id}-${t.curso.gestion}`;
    conflictos[key] = (conflictos[key] || 0) + 1;
  });


  const esConflicto = (tutor: Tutor) => {
    const key = `${tutor.personal.id}-${tutor.curso.gestion}`;
    return conflictos[key] > 1;
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Gestión</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Paralelo</TableCell>
            <TableCell>Docente</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tutores.map((t) => {
            const conflicto = esConflicto(t);

            return (
              <TableRow
                key={t.id}
                sx={{
                  backgroundColor: conflicto ? "#fdecea" : "inherit",
                }}
              >
                <TableCell>{t.curso.gestion}</TableCell>
                <TableCell>{t.curso.nombre}</TableCell>
                <TableCell>{t.curso.paralelo.nombre}</TableCell>
                <TableCell>
                  {`${t.personal.nombres} ${t.personal.apellidoPat} ${t.personal.apellidoMat}`}
                </TableCell>
                <TableCell>
                  <Boton
                    label="Editar"
                    color="warning"
                    onClick={() => onEdit(t)}
                    size="small"
                  />

                  <Boton
                    label="Eliminar"
                    color="error"
                    size="small"
                    onClick={() => onDelete(t.id)}
                    className="ml-2"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
