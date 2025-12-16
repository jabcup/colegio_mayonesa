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
    Tab,
} from "@mui/material";
import { getAuthData } from "@/app/lib/auth";

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
    cursos: Curso[]
    onEdit: (curso: Curso) => void
    onDelete: (id: number) => void
}

export default function TablaCurso({ cursos, onEdit, onDelete }: Props) {

    const { rol } = getAuthData();

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
                    {cursos.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell>{c.nombre}</TableCell>
                            <TableCell>{c.paralelo}</TableCell>
                            <TableCell>{c.gestion}</TableCell>
                            {/* <TableCell>{c.capacidad}</TableCell> */}
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}