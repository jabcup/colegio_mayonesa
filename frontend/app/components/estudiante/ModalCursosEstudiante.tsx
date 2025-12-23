"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";

export interface Root2 {
    id: number
    curso: Curso
    fecha_creacion: string
    estado: string
}

export interface Curso {
    id: number
    nombre: string
    paralelo: Paralelo
    gestion: number
    capacidad: number
    fechaCreacion: string
    estado: string
}

export interface Paralelo {
    id: number
    nombre: string
    estado: string
    fecha_creacion: string
}

interface Props {
    open: boolean;
    onClose: () => void;
    cursos: Root2[];
}

export default function ModalCursosEstudiante({
    open,
    onClose,
    cursos,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Cursos del Estudiante</DialogTitle>

            <DialogContent dividers>
                {cursos.length === 0 ? (
                    <Typography>No hay cursos asignados</Typography>
                ) : (
                    cursos.map((curso) => (
                        <Box
                            key={curso.id}
                            mb={2}
                            p={2}
                            border={1}
                            borderRadius={2}
                        >
                            <Typography variant="subtitle1">
                                <strong>Curso:</strong> {curso.curso.nombre} {curso.curso.paralelo.nombre}
                            </Typography>

                            {curso.curso.fechaCreacion && (
                                <Typography variant="body2">
                                    <strong>Fecha de Inscripción/Asignación:</strong>{" "}
                                    {new Intl.DateTimeFormat("es-BO", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }).format(new Date(curso.curso.fechaCreacion))}
                                </Typography>
                            )}


                            {curso.curso.gestion && (
                                <Typography variant="body2">
                                    <strong>Gestión:</strong> {curso.curso.gestion}
                                </Typography>
                            )}

                            {curso.curso.capacidad && (
                                <Typography variant="body2">
                                    <strong>Capacidad:</strong> {curso.curso.capacidad}
                                </Typography>
                            )}
                        </Box>
                    ))
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
