'use client';

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    MenuItem,
    TextField,
    Button,
} from "@mui/material";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

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
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.nombre}</TableCell>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}