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
  Tab,
  Tooltip,
  IconButton,
  TablePagination,
} from "@mui/material";
import { getAuthData } from "@/app/lib/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
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
  // Paginacion
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
            <TableCell>Gestion</TableCell>
            {/* <TableCell>Capacidad</TableCell> */}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cursosPaginados.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.nombre}</TableCell>
              <TableCell>{c.paralelo}</TableCell>
              <TableCell>{c.gestion}</TableCell>
              {/* <TableCell>{c.capacidad}</TableCell> */}
              <TableCell>
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
              {/* <TableCell>
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
                            </TableCell> */}
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
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
}
