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

interface Props {
  calificaciones: CalificacionFiltrada[];
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

export default function TableCalificacion({ calificaciones }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [loading, setLoading] = useState(false);
  const [calificacionesFiltradas, setCalificacionesFiltradas] = useState<
    CalificacionFiltrada[]
  >([]);

  const [filtro, setFiltro] = useState({
    idCurso: "",
    idMateria: "",
  });

  const cargarDatos = async () => {
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
      setCalificacionesFiltradas(calificacionesMap); // suponer que backend devuelve estudiantes con calificaciones
    } catch (err) {
      console.error(err);
      alert("Error al cargar calificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
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
  return (
    <>
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
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Calificación</TableCell>
              <TableCell>Aprobación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calificacionesFiltradas.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.estudiante.nombres} {c.estudiante.apellidoPat}{" "}
                  {c.estudiante.apellidoMat}
                </TableCell>
                <TableCell>{c.calificacion}</TableCell>
                <TableCell>{c.aprobacion ? "Aprobado" : "Reprobado"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
