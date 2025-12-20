"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { getAuthData } from "@/app/lib/auth";

interface Paralelo {
  id: number;
  nombre: string;
}

interface Curso {
  id: number;
  nombre: string;
  paralelo: Paralelo | null; // ← Permitimos null por seguridad
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface Props {
  cursos: Curso[];
  onEdit: (curso: Curso) => void;
  onDelete: (id: number) => void;
}

export default function TablaCurso({ cursos, onEdit, onDelete }: Props) {
  const { rol } = getAuthData();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cursosPaginados = cursos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Paralelo</TableCell>
            <TableCell>Gestión</TableCell>
            <TableCell>Capacidad</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cursosPaginados.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell>{c.nombre}</TableCell>
              <TableCell>
                {c.paralelo ? c.paralelo.nombre : "-"} {/* ← Protección contra null */}
              </TableCell>
              <TableCell>{c.gestion}</TableCell>
              <TableCell>{c.capacidad}</TableCell>
              <TableCell align="center">
                <Tooltip title="Editar">
                  <IconButton color="primary" onClick={() => onEdit(c)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={() => onDelete(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={cursos.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </TableContainer>
  );
}