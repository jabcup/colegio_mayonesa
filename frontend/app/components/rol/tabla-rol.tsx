'use client';

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
import { getAuthData } from "@/app/lib/auth";

interface Rol {
    id: number;
    nombre: string;
}

interface Props {
    roles: Rol[]
    onEdit: (rol: Rol) => void
    onDelete: (id: number) => void
}

export default function TablaRol({ roles, onEdit, onDelete }: Props) {

    const { rol } = getAuthData();

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        {rol !== "Secretaria-o" && (
                        <TableCell>Acciones</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.nombre}</TableCell>
                            {rol !== "Secretaria-o" && (
                            <TableCell>
                                <Button 
                                  variant="outlined"
                                  onClick={() => onEdit(r)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                  variant="outlined"
                                  color="error"
                                  onClick={() => onDelete(r.id)}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}