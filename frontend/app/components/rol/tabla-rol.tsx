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

interface Rol {
  id: number;
  nombre: string;
}

interface Props {
  roles: Rol[];
  onEdit: (rol: Rol) => void;
  onDelete: (id: number) => void;
}

export default function TablaRol({ roles, onEdit, onDelete }: Props) {
  const { rol } = getAuthData();

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            {rol !== "Secretaria-o" && <TableCell>Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.nombre}</TableCell>
              {rol !== "Secretaria-o" && (
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(r)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(r.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
