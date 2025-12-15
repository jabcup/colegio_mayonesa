"use client";

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
} from "@mui/material";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface asistenciaFiltrada {
  id: number;
  fecha: string;
  estado: string;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
}
interface asistenciaBackend {
  asistencia_id: number;
  asistencia_fecha: string;
  asistencia_estado: string;
  estudiante_id: number;
  estudiante_nombres: string;
  estudiante_apellidoPat: string;
  estudiante_apellidoMat: string;
}
interface Props {
  asistencias: asistenciaFiltrada[];
}
export default function TableAsistencias({ asistencias }: Props) {
  const [filteredAsistencias, setFilteredAsistencias] = useState<asistenciaFiltrada[]>(asistencias);
  const [selectedEstudiante, setSelectedEstudiante] = useState<string>("");
    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await api.get<asistenciaBackend[]>("/asistencias/VerAsistencias");
                const mappedAsistencias = response.data.map((asistencia) => ({
                    id: asistencia.asistencia_id,
                    fecha: asistencia.asistencia_fecha,
                    estado: asistencia.asistencia_estado,
                    estudiante: {
                        id: asistencia.estudiante_id,
                        nombres: asistencia.estudiante_nombres,
                        apellidoPat: asistencia.estudiante_apellidoPat,
                        apellidoMat: asistencia.estudiante_apellidoMat,
                    },
                }));
                setFilteredAsistencias(mappedAsistencias);
            } catch (error) {
                console.error("Error fetching asistencias:", error);
            }
        };
        fetchAsistencias();
    }, []);

    const handleEstudianteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const estudianteId = event.target.value;
        setSelectedEstudiante(estudianteId);
        if (estudianteId) {
            setFilteredAsistencias(
                asistencias.filter(
                    (asistencia) => asistencia.estudiante.id.toString() === estudianteId
                )
            );
        } else {
            setFilteredAsistencias(asistencias);
        }
    };

    const uniqueEstudiantes = Array.from(
        new Set(asistencias.map((a) => a.estudiante.id))
    ).map((id) => {
        const estudiante = asistencias.find((a) => a.estudiante.id === id)?.estudiante;
        return { id: id, nombres: estudiante?.nombres || "", apellidoPat: estudiante?.apellidoPat || "", apellidoMat: estudiante?.apellidoMat || "" };
    });
    return (
        <>
            <TextField
                select
                label="Filtrar por Estudiante"
                value={selectedEstudiante}
                onChange={handleEstudianteChange}
                sx={{ mr: 2, mb: 2, minWidth: 200 }}
            >
                <MenuItem value="">Todos los Estudiantes</MenuItem>
                {uniqueEstudiantes.map((est) => (
                    <MenuItem key={est.id} value={est.id.toString()}>
                        {est.nombres} {est.apellidoPat} {est.apellidoMat}
                    </MenuItem>
                ))}
            </TextField>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Estudiante</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAsistencias.map((asistencia) => (
                            <TableRow key={asistencia.id}>
                                <TableCell>
                                    {asistencia.estudiante.nombres} {asistencia.estudiante.apellidoPat}{" "}
                                    {asistencia.estudiante.apellidoMat}
                                </TableCell>
                                <TableCell>{asistencia.fecha}</TableCell>
                                <TableCell>{asistencia.estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}