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
  Button,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import { useState, useMemo } from "react";
import { getAuthData } from "@/app/lib/auth";

interface Paralelo {
  id: number;
  nombre: string;
}

interface Curso {
  id: number;
  nombre: string;
  paralelo: Paralelo | null;
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
  const [orderAsc, setOrderAsc] = useState(false); // false = Z→A (predeterminado), true = A→Z

  // Ordenamiento por Nombre del curso, luego por Paralelo
  const cursosOrdenados = useMemo(() => {
    return [...cursos].sort((a, b) => {
      // Primero por nombre del curso
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      const comparacionNombre = nombreA.localeCompare(nombreB);

      if (comparacionNombre !== 0) {
        return orderAsc ? comparacionNombre : -comparacionNombre;
      }

      // Si los nombres son iguales, ordenar por paralelo
      const paraleloA = a.paralelo?.nombre || "";
      const paraleloB = b.paralelo?.nombre || "";
      const comparacionParalelo = paraleloA.toLowerCase().localeCompare(paraleloB.toLowerCase());

      return orderAsc ? comparacionParalelo : -comparacionParalelo;
    });
  }, [cursos, orderAsc]);

  const cursosPaginados = useMemo(() => {
    return cursosOrdenados.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [cursosOrdenados, page, rowsPerPage]);

  const handleToggleOrder = () => {
    setOrderAsc((prev) => !prev);
    setPage(0); // Reiniciar paginación al cambiar orden
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Botón de ordenar encima de la tabla, esquina superior izquierda */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SortIcon />}
          onClick={handleToggleOrder}
          sx={{
            textTransform: "none",
            fontWeight: "medium",
            boxShadow: 2,
            "&:hover": { boxShadow: 4 },
          }}
        >
          Ordenar por Nombre {orderAsc ? "(A → Z)" : "(Z → A)"}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
          Total de cursos: {cursos.length}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Paralelo
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Gestión
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Capacidad
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cursosPaginados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay cursos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cursosPaginados.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.paralelo ? c.paralelo.nombre : "-"}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={cursos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
}