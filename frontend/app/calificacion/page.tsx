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

import FormCalificacion from "../components/calificacion/form-calificacion";
import TableCalificacion from "../components/calificacion/table-calificacion";

interface CalificacionFiltrada {
  id: number;
  calificacion: number;
  aprobacion: boolean;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
}

interface CalificacionBackend {
  calificacion_id: number;
  calificacion_calificacion: string;
  calificacion_aprobacion: number;
  estudiante_id: number;
  estudiante_nombres: string;
  estudiante_apellidoPat: string;
  estudiante_apellidoMat: string;
  materia_id: number;
  materia_nombre: string;
}

export interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

export interface MateriaDocente {
  idMateria: number;
  nombre: string;
}

interface BackAsignacionClase {
  id: number;
  nombre: string;
  paralelo: string;
}

interface BackMateriaDocente {
  id: number;
  nombre: string;
}

export interface UpdateCalificacionDto {
  calificacion: number;
}

export default function CalificacionPage() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionFiltrada[]>(
    []
  );

  const [filtro, setFiltro] = useState({
    idCurso: "",
    idMateria: "",
  });

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const idDocente = 4;
      const cursosRes = await api.get(
        `/asignacion-clases/por-docente/${idDocente}`
      );
      const cursosMap = (cursosRes.data as BackAsignacionClase[]).map((a) => ({
        idCurso: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
      }));

      setCursosDocente(cursosMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarCalificaciones = async () => {
    if (!filtro.idCurso || !filtro.idMateria) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/calificaciones/BuscarCalificacionesPorCursoYMateria/${Number(
          filtro.idCurso
        )}/${Number(filtro.idMateria)}`
      );

      const calificacionesMap: CalificacionFiltrada[] = (
        res.data.calificaciones || []
      ).map((c: CalificacionBackend) => ({
        id: c.calificacion_id,
        calificacion: Number(c.calificacion_calificacion),
        aprobacion: Boolean(c.calificacion_aprobacion),
        estudiante: {
          id: c.estudiante_id,
          nombres: c.estudiante_nombres,
          apellidoPat: c.estudiante_apellidoPat,
          apellidoMat: c.estudiante_apellidoMat,
        },
        materia: {
          id: c.materia_id,
          nombre: c.materia_nombre,
        },
      }));
      setCalificaciones(calificacionesMap); // suponer que backend devuelve estudiantes con calificaciones
    } catch (err) {
      console.error(err);
      alert("Error al cargar calificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  useEffect(() => {
    cargarCalificaciones();
  }, [filtro.idCurso, filtro.idMateria]);

  const handleCursoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idCurso = e.target.value;
    setFiltro({ ...filtro, idCurso, idMateria: "" });

    const idDocente = 4;

    setLoading(true);
    try {
      const materiaRes = await api.get(
        `/asignacion-clases/materias-por-docente-curso/${idDocente}/${Number(
          idCurso
        )}`
      );
      const materiasMap = (materiaRes.data as BackMateriaDocente[]).map(
        (m) => ({
          idMateria: m.id,
          nombre: m.nombre,
        })
      );
      setMateriasCurso(materiasMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleMateriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idMateria = e.target.value;
    setFiltro({ ...filtro, idMateria });
  };

  // Función para crear una nueva calificación
  const crearCalificacion = async (data: unknown) => {
    try {
      await api.post("/calificaciones", data);
      alert("Calificación creada con éxito");
    } catch (err) {
      console.error(err);
      alert("Error al crear la calificación");
    }
  };

  // Funcion para eliminar una calificacion
  const eliminarCalificacion = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta calificación?")) return;

    try {
      await api.delete(`/calificaciones/EliminarCalificacion/${id}`);
      alert("Calificación eliminada");

      cargarCalificaciones(); // recargar tabla
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  // Funcion para editar una calificacion
  const [selectedCalificacion, setSelectedCalificacion] =
    useState<CalificacionFiltrada | null>(null);

  const editarCalificacion = (calificacion: CalificacionFiltrada) => {
    setSelectedCalificacion(calificacion);
    setShowForm(true);
  };

  const actualizarCalificacion = async (data: UpdateCalificacionDto) => {
    if (!selectedCalificacion) return;

    try {
      await api.put(
        `/calificaciones/EditarCalificacion/${selectedCalificacion.id}`,
        data
      );
      alert("Calificación actualizada");

      setShowForm(false);
      setSelectedCalificacion(null);
      cargarCalificaciones();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    }
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Página de Calificaciones
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowForm(true)}
        sx={{ mb: 2 }}
      >
        Realizar una Calificación
      </Button>

      <TextField
        select
        label="Filtrar por Curso"
        value={filtro.idCurso}
        onChange={handleCursoChange}
        sx={{ mr: 2, mb: 2, minWidth: 200 }}
      >
        {cursosDocente.map((c) => (
          <MenuItem key={c.idCurso} value={c.idCurso.toString()}>
            {c.nombre} - {c.paralelo}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Filtrar por Materia"
        value={filtro.idMateria}
        onChange={handleMateriaChange}
        sx={{ mr: 2, mb: 2, minWidth: 200 }}
        disabled={!filtro.idCurso}
      >
        {materiasCurso.map((m) => (
          <MenuItem key={m.idMateria} value={m.idMateria.toString()}>
            {m.nombre}
          </MenuItem>
        ))}
      </TextField>

      {/* Tabla */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableCalificacion
          calificaciones={calificaciones}
          onEdit={editarCalificacion}
          onDelete={eliminarCalificacion}
        />
      )}

      <FormCalificacion
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={crearCalificacion}
        onUpdate={actualizarCalificacion}
        selectedCalificacion={selectedCalificacion}
      />
    </>
  );
}
