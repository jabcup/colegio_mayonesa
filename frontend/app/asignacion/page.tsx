"use client";
import Navbar from "@/app/components/Navbar/navbar";

import {
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

import HorarioTabla from "../components/asignacion/horario-tabla";
import FormAsignacion from "../components/asignacion/form-asignacion";

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
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

export default function AsignacionPage() {
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

  const [cursos, setCursos] = useState<Curso[]>([]);

  const [modoEdicion, setModoEdicion] = useState(false);

  const [contextoAsignacion, setContextoAsignacion] = useState<{
    idAsignacion?: number;
    dia: string;
    idHorario: number;
    idDocente?: number;
    idMateria?: number;
  } | null>(null);

  const cargarCursos = async () => {
    setLoadingCursos(true);
    try {
      const cursosRes = await api.get(`/cursos/CursosActivos`);
      const cursosMap = (cursosRes.data as Curso[]).map((a) => ({
        id: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
        gestion: a.gestion,
        capacidad: a.capacidad,
        fechaCreacion: a.fechaCreacion,
        estado: a.estado,
      }));

      setCursos(cursosMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos");
    } finally {
      setLoadingCursos(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const [selectedCurso, setSelectedCurso] = useState<number | "">("");

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

  const handleAbrirAsignacion = (dia: string, idHorario: number) => {
    setContextoAsignacion({ dia, idHorario });
    setModoEdicion(false);
    setShowForm(true);
  };

  const handleGuardarAsignacion = async ({
    idMateria,
    idDocente,
  }: {
    idMateria: number;
    idDocente: number;
  }) => {
    if (!contextoAsignacion || !selectedCurso) return;

    if (modoEdicion && contextoAsignacion.idAsignacion) {
      await api.put(
        `/asignacion-clases/ActualizarAsignacion/${contextoAsignacion.idAsignacion}`,
        {
          idMateria,
          idPersonal: idDocente,
        }
      );
    } else {
      const payload = {
        idCurso: selectedCurso,
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

    cargarAsignaciones(String(selectedCurso));
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

      <TextField
        select
        label="Filtrar por Curso"
        value={selectedCurso}
        fullWidth
        margin="normal"
        onChange={(e) => {
          const cursoId = Number(e.target.value);
          setSelectedCurso(cursoId);
          cargarAsignaciones(e.target.value); // Al seleccionar un curso, cargar las asignaciones
        }}
      >
        {cursos.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.nombre}
          </MenuItem>
        ))}
      </TextField>

      {loadingAsignaciones ? (
        <CircularProgress />
      ) : (
        <HorarioTabla
          asignaciones={asignaciones}
          onAsignar={handleAbrirAsignacion}
          onEditar={handleEditarAsignacion}
        />
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
