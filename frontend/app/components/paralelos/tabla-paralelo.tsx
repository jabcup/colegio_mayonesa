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
  Tooltip,
  IconButton,
} from "@mui/material";
import { getAuthData } from "@/app/lib/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Boton } from "../botones/botonNav";

interface Paralelo {
  id: number;
  nombre: string;
}

interface Props {
  paralelos: Paralelo[];
  onEdit: (paralelo: Paralelo) => void;
  onDelete: (id: number) => void;
}

export default function TablaParalelo({ paralelos, onEdit, onDelete }: Props) {
  const { rol } = getAuthData();

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Paralelos</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paralelos.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.nombre}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(p)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(p.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
