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
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

// export default
export default function TableCalificacion({
  calificaciones,
  onEdit,
  onDelete,
}: Props) {
  //Paginacion
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calificacionesPaginadas = calificaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, pr: 4, pl: 4 }}>
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
            {calificacionesPaginadas.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.estudiante.nombres} {c.estudiante.apellidoPat}{" "}
                  {c.estudiante.apellidoMat}
                </TableCell>
                <TableCell>{c.calificacion}</TableCell>
                <TableCell>{c.aprobacion ? "Aprobado" : "Reprobado"}</TableCell>
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
                {/* <TableCell>
                  <Button variant="outlined" onClick={() => onEdit(c)}>
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
          count={calificaciones.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>
    </>
  );
}
