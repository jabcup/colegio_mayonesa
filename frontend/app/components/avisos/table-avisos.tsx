"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface Curso {
  id: number;
  nombre: string;
  nivel?: string;
  paralelo?: string;
}

interface Aviso {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
  Curso: Curso;
}

export default function TableAvisos({ onEdit }: { onEdit?: (aviso: Aviso) => void }) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [loadingAvisos, setLoadingAvisos] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoadingCursos(true);
    try {
      const res = await api.get("/cursos/MostrarCursos");
      setCursos(res.data);
    } catch (err) {
      alert("Error al cargar cursos");
    } finally {
      setLoadingCursos(false);
    }
  };

  const cargarAvisos = async () => {
    if (!selectedCurso) return;

    setLoadingAvisos(true);
    try {
      const res = await api.get(`/avisos/Curso/${selectedCurso.id}`);
      let data = res.data as Aviso[];

      data = data.sort((a, b) =>
        sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      );

      setAvisos(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar avisos");
      setAvisos([]);
    } finally {
      setLoadingAvisos(false);
    }
  };

  useEffect(() => {
    if (selectedCurso) {
      cargarAvisos();
    } else {
      setAvisos([]);
    }
  }, [selectedCurso]);

  const toggleSort = () => {
    setSortDesc(!sortDesc);
    setAvisos((prev) =>
      [...prev].sort((a, b) =>
        !sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      )
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este aviso? (Se marcará como inactivo)")) {
      return;
    }

    try {
      await api.delete(`/avisos/${id}`);
      alert("Aviso eliminado correctamente");
      cargarAvisos();
    } catch (err) {
      alert("Error al eliminar el aviso");
    }
  };

  const formatoFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNombreCurso = (curso: Curso) =>
    `${curso.nombre} ${curso.nivel ? `- ${curso.nivel}` : ""} ${curso.paralelo || ""}`.trim();

  const getOptionLabel = (option: Curso) => getNombreCurso(option);

  return (
    <Box sx={{ mt: 4 }}>
      <Autocomplete
        options={cursos}
        getOptionLabel={getOptionLabel}
        value={selectedCurso}
        onChange={(_event, newValue) => setSelectedCurso(newValue)}
        loading={loadingCursos}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar curso por nombre, nivel o paralelo"
            placeholder="Escribe para buscar..."
            fullWidth
            sx={{ maxWidth: 600 }}
          />
        )}
        noOptionsText="No se encontraron cursos"
      />

      {selectedCurso && (
        <>
          <Box sx={{ mt: 3, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">
              Avisos del curso: <strong>{getNombreCurso(selectedCurso)}</strong>
            </Typography>
            <Button variant="outlined" onClick={toggleSort}>
              Ordenar: {sortDesc ? "Más reciente" : "Más antiguo"}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Curso</strong></TableCell>
                  <TableCell><strong>Asunto</strong></TableCell>
                  <TableCell><strong>Mensaje</strong></TableCell>
                  <TableCell><strong>Fecha Envío</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingAvisos ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : avisos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No hay avisos para este curso.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  avisos.map((aviso) => (
                    <TableRow key={aviso.id}>
                      <TableCell>{getNombreCurso(aviso.Curso)}</TableCell>
                      <TableCell>{aviso.asunto}</TableCell>
                      <TableCell>{aviso.mensaje}</TableCell>
                      <TableCell>{formatoFecha(aviso.fecha_creacion)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => onEdit?.(aviso)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(aviso.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}