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
import { Boton } from "../botones/botonNav";

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
                                    <Boton
                                        label="Editar"
                                        color="warning"
                                        size="small"
                                        onClick={() => onEdit(r)}
                                        className="mr-2"
                                    />
                                    <Boton
                                      label="Eliminar"
                                        color="error"
                                        size="small"
                                        onClick={() => onDelete(r.id)}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}