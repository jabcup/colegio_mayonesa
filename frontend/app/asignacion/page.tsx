"use client";
import Navbar from "@/app/components/Navbar/navbar";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

import HorarioTabla from "../components/asignacion/horario-tabla";
import FormAsignacion from "../components/asignacion/form-asignacion";

import Autocomplete from "@mui/material/Autocomplete";

interface Curso {
  id: number;
  nombre: string;
  paralelo: { nombre: string }; // Ajustado porque ahora es objeto
  gestion: number;
}

interface Asignacion {
  idAsignacion: number;
  dia: string;
  idHorario: number;
  horario: string;
  idDocente: number;
  docente: string;
  idMateria: number;
  materia: string;
}

interface Horario {
  id: number;
  horario: string;
  estado: string;
}

export default function AsignacionPage() {
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

  const [cursos, setCursos] = useState<Curso[]>([]);

  const [horarios, setHorarios] = useState<Horario[]>([]);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [contextoAsignacion, setContextoAsignacion] = useState<{
    idAsignacion?: number;
    dia: string;
    idHorario: number;
    idDocente?: number;
    idMateria?: number;
  } | null>(null);

  const [vistaAuditoria, setVistaAuditoria] = useState(false);

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  const cargarCursos = async () => {
    setLoadingCursos(true);
    try {
      const cursosRes = await api.get(`/cursos/CursosActivos`);
      setCursos(cursosRes.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos");
    } finally {
      setLoadingCursos(false);
    }
  };

  const cargarHorarios = async () => {
    try {
      const horariosRes = await api.get(`/horarios/mostrarHorarios`);
      setHorarios(
        horariosRes.data.filter((h: Horario) => h.estado === "activo")
      );
    } catch (err) {
      console.error(err);
      alert("Error al cargar los horarios");
    }
  };

  const cargarAsignaciones = async (cursoId: string) => {
    const cursoIdInt = parseInt(cursoId);
    setLoadingAsignaciones(true);
    try {
      const asignacionesRes = await api.get(
        `/asignacion-clases/curso/${cursoIdInt}`
      );
      setAsignaciones(asignacionesRes.data); // Aquí iría la lógica para pintar el horario
    } catch (err) {
      console.error(err);
      alert("Error al cargar las asignaciones");
    } finally {
      setLoadingAsignaciones(false);
    }
  };

  useEffect(() => {
    cargarCursos();
    cargarHorarios();
  }, []);

  const handleCursoChange = (newValue: Curso | null) => {
    setSelectedCurso(newValue);
    setVistaAuditoria(false); // Volver al horario al cambiar curso

    if (newValue) {
      cargarAsignaciones(newValue.id);
    } else {
      setAsignaciones([]);
    }
  };

  const handleAbrirAsignacion = (dia: string, idHorario: number) => {
    setContextoAsignacion({ dia, idHorario });
    setModoEdicion(false);
    setShowForm(true);
  };

  const handleGuardarAsignacion = async ({
    idMateria,
    idDocente,
    nombreMateria,
    nombreDocente,
  }: {
    idMateria: number;
    idDocente: number;
    nombreMateria: string;
    nombreDocente: string;
  }) => {
    // if (!contextoAsignacion || !selectedCurso) return;
    if (!contextoAsignacion || !selectedCurso) return;

    if (modoEdicion && contextoAsignacion.idAsignacion) {
      await api.put(
        `/asignacion-clases/ActualizarAsignacion/${contextoAsignacion.idAsignacion}`,
        {
          dia: contextoAsignacion.dia,
          idHorario: contextoAsignacion.idHorario,
          idMateria,
          idPersonal: idDocente,
          idCurso: selectedCurso.id,
          // idCurso: selectedCurso,
        }
      );
    } else {
      const payload = {
        idCurso: selectedCurso.id,
        // idCurso: selectedCurso,
        dia: contextoAsignacion.dia,
        idHorario: contextoAsignacion.idHorario,
        idMateria,
        idPersonal: idDocente,
      };

      await api.post("/asignacion-clases/CrearAsignacion", payload);
    }

    setShowForm(false);
    setContextoAsignacion(null);
    setModoEdicion(false);

    cargarAsignaciones(String(selectedCurso.id));
  };

  const handleEditarAsignacion = (data: {
    idAsignacion: number;
    dia: string;
    idHorario: number;
    idDocente: number;
    idMateria: number;
  }) => {
    setContextoAsignacion(data);
    setModoEdicion(true);
    setShowForm(true);
  };

  return (
    <>
      <Navbar />

      <Typography variant="h4">Asignacion de Clases</Typography>

      <Autocomplete
        options={cursos}
        getOptionLabel={(option) =>
          `${option.nombre} - ${option.paralelo.nombre} (${option.gestion})`
        }
        value={selectedCurso}
        onChange={(_, newValue) => {
          setSelectedCurso(newValue);

          if (newValue) {
            cargarAsignaciones(String(newValue.id));
          } else {
            setAsignaciones([]);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filtrar por Curso"
            margin="normal"
            fullWidth
          />
        )}
      />

      {!selectedCurso ? (
        <Typography sx={{ mt: 3 }} color="text.secondary">
          Selecciona un curso para visualizar las asignaciones
        </Typography>
      ) : loadingAsignaciones ? (
        <CircularProgress />
      ) : (
        <>
          {/* Botón para alternar vista */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              color={vistaAuditoria ? "secondary" : "primary"}
              onClick={() => setVistaAuditoria(!vistaAuditoria)}
            >
              {vistaAuditoria
                ? "← Volver al Horario"
                : "Ver Auditoría de Docentes Asignados"}
            </Button>
          </Box>

          {/* Vista condicional */}
          {vistaAuditoria ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Día</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hora</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Materia</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Docente</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asignaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay asignaciones para este curso aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    asignaciones.map((a) => (
                      <TableRow key={a.idAsignacion}>
                        <TableCell>{a.dia}</TableCell>
                        <TableCell>{a.horario}</TableCell>
                        <TableCell>{a.materia}</TableCell>
                        <TableCell>{a.docente}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <HorarioTabla
              horarios={horarios}
              asignaciones={asignaciones}
              onAsignar={handleAbrirAsignacion}
              onEditar={handleEditarAsignacion}
            />
          )}
        </>
      )}

      <FormAsignacion
        open={showForm}
        dia={contextoAsignacion?.dia || ""}
        idHorario={contextoAsignacion?.idHorario || 0}
        idAsignacionActual={contextoAsignacion?.idAsignacion}
        modoEdicion={modoEdicion}
        valoresIniciales={
          modoEdicion
            ? {
                idDocente: contextoAsignacion?.idDocente,
                idMateria: contextoAsignacion?.idMateria,
              }
            : undefined
        }
        onClose={() => {
          setShowForm(false);
          setContextoAsignacion(null);
          setModoEdicion(false);
        }}
        onGuardar={handleGuardarAsignacion}
      />
    </>
  );
}
