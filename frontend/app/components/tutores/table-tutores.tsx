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
    paralelo: string;
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

  //Detectar si hay duplicidad de tutor 
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
                <TableCell>{t.curso.paralelo}</TableCell>
                <TableCell>
                  {`${t.personal.nombres} ${t.personal.apellidoPat} ${t.personal.apellidoMat}`}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => onEdit(t)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(t.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
