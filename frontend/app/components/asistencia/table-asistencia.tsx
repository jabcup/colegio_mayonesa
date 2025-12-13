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

interface AsistenciaFiltrada {
  id: number;
  asistencia: string;
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

interface AsistenciaBackend {
  asistencia_id: number;
  asistencia_asistencia: string;
  estudiante_id: number;
  estudiante_nombres: string;
  estudiante_apellidoPat: string;
  estudiante_apellidoMat: string;
  materia_id: number;
  materia_nombre: string;
}

interface Props {
  asistencias: AsistenciaFiltrada[];
}

export interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

export interface AsignacionDocente {
  idAsignacion: number;
  nombre: string;
}

interface BackAsignacionClase {
  id: number;
  nombre: string;
  paralelo: string;
}

interface BackAsignacionDocente {
  id: number;
  nombre: string;
}

export default function TableAsistencia({ asistencias }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [asignacionesCurso, setAsignacionesCurso] = useState<AsignacionDocente[]>([]);
  const [loading, setLoading] = useState(false);
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState<
    AsistenciaFiltrada[]
  >([]);

  const [filtro, setFiltro] = useState({
    idCurso: "",
    idAsignacion: "",
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const idDocente = 1;
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

  const cargarAsistencias = async () => {
    if (!filtro.idCurso || !filtro.idAsignacion) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/asistencias/BuscarAsistenciasPorCursoYMateria/${Number(
          filtro.idCurso
        )}/${Number(filtro.idAsignacion)}`
      );

      const asistenciasMap: AsistenciaFiltrada[] = (
        res.data.asistencias || []
      ).map((c: AsistenciaBackend) => ({
        id: c.asistencia_id,
        asistencia: c.asistencia_asistencia,
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
      setAsistenciasFiltradas(asistenciasMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar asistencias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    cargarAsistencias();
  }, [filtro.idCurso, filtro.idAsignacion]);

  const handleCursoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idCurso = e.target.value;
    setFiltro({ ...filtro, idCurso, idAsignacion: "" });

    const idDocente = 1;

    setLoading(true);
    try {
      const asignacionRes = await api.get(
        `/asignacion-clases/materias-por-docente-curso/${idDocente}/${Number(
          idCurso
        )}`
      );
      const asignacionesMap = (asignacionRes.data as BackAsignacionDocente[]).map(
        (m) => ({
          idAsignacion: m.id,
          nombre: m.nombre,
        })
      );
      setAsignacionesCurso(asignacionesMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar las asignaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleAsignacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idAsignacion = e.target.value;
    setFiltro({ ...filtro, idAsignacion });
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
        value={filtro.idAsignacion}
        onChange={handleAsignacionChange}
        sx={{ mr: 2, mb: 2, minWidth: 200 }}
        disabled={!filtro.idCurso}
      >
        {asignacionesCurso.map((m) => (
          <MenuItem key={m.idAsignacion} value={m.idAsignacion.toString()}>
            {m.nombre}
          </MenuItem>
        ))}
      </TextField>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Asistencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistenciasFiltradas.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.estudiante.nombres} {c.estudiante.apellidoPat}{" "}
                  {c.estudiante.apellidoMat}
                </TableCell>
                <TableCell>{c.asistencia}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}