"use client";

import Navbar from "@/app/components/Navbar/navbar";
import {
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getAuthData } from "../lib/auth";

// Componentes correctos
import TableCalificacionTrimestral from "../components/calificacion/table-cali";
import FormNotaTrimestre from "../components/calificacion/form-cali";

interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

interface MateriaDocente {
  idMateria: number;
  nombre: string;
}

interface EstudianteCalificacion {
  estudianteId: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  nombresCompletos: string;
  trim1: number | null;
  trim2: number | null;
  trim3: number | null;
  calificacionFinal: number | null;
  aprobacion: boolean;
  registroId: number | null; // puede ser null si no existe registro aún
}

interface NotaEdit {
  estudianteId: number;
  nombresCompletos: string;
  trimestre: 1 | 2 | 3;
  valorActual: number | null;
  registroId: number | null;
}

export default function CalificacionPage() {
  const [loading, setLoading] = useState(true);
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [calificaciones, setCalificaciones] = useState<
    EstudianteCalificacion[]
  >([]);

  const [filtro, setFiltro] = useState({
    idCurso: "",
    idMateria: "",
  });

  const [notaEdit, setNotaEdit] = useState<NotaEdit | null>(null);

  const { idPersonal } = getAuthData();
  const anioEscolarActual = new Date().getFullYear(); // 2025

  // Cargar cursos del docente
  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/asignacion-clases/por-docente/${idPersonal}`);
      const cursosMap = res.data.map((a: any) => ({
        idCurso: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
      }));
      setCursosDocente(cursosMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los cursos del docente");
    } finally {
      setLoading(false);
    }
  };

  // Cargar calificaciones (usa tu ruta existente)
  const cargarCalificaciones = async () => {
    if (!filtro.idCurso || !filtro.idMateria) {
      setCalificaciones([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/calificaciones/BuscarCalificacionesPorCursoYMateria/${filtro.idCurso}/${filtro.idMateria}`
      );

      const mapped: EstudianteCalificacion[] = res.data.calificaciones.map(
        (item: any) => ({
          estudianteId: item.estudiante.id,
          nombres: item.estudiante.nombres,
          apellidoPat: item.estudiante.apellidoPat,
          apellidoMat: item.estudiante.apellidoMat,
          nombresCompletos:
            `${item.estudiante.nombres} ${item.estudiante.apellidoPat} ${item.estudiante.apellidoMat}`.trim(),
          trim1: item.trim1 !== undefined ? Number(item.trim1) : null,
          trim2: item.trim2 !== undefined ? Number(item.trim2) : null,
          trim3: item.trim3 !== undefined ? Number(item.trim3) : null,
          calificacionFinal: item.calificacion_final
            ? Number(item.calificacion_final)
            : null,
          aprobacion: item.aprobacion,
          registroId: item.calificacion_id || null,
        })
      );

      setCalificaciones(mapped);
    } catch (err) {
      console.error(err);
      alert("Error al cargar las calificaciones");
      setCalificaciones([]);
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
    setFiltro({ idCurso, idMateria: "" });
    setCalificaciones([]);

    if (!idCurso) {
      setMateriasCurso([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `/asignacion-clases/materias-por-docente-curso/${idPersonal}/${idCurso}`
      );
      const materiasMap = res.data.map((m: any) => ({
        idMateria: m.id,
        nombre: m.nombre,
      }));
      setMateriasCurso(materiasMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar las materias");
    } finally {
      setLoading(false);
    }
  };

  const handleMateriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({ ...filtro, idMateria: e.target.value });
  };

  // Verificar si se puede editar el trimestre
  const puedeEditarTrimestre = (
    est: EstudianteCalificacion,
    trimestre: 1 | 2 | 3
  ): boolean => {
    if (trimestre === 1) return true;
    if (trimestre === 2) return est.trim1 !== null;
    if (trimestre === 3) return est.trim1 !== null && est.trim2 !== null;
    return false;
  };

  // Abrir modal de edición
  const abrirEdicionNota = (
    estudiante: EstudianteCalificacion,
    trimestre: 1 | 2 | 3
  ) => {
    if (!puedeEditarTrimestre(estudiante, trimestre)) {
      alert(
        trimestre === 2
          ? "Debe ingresar primero la nota del Trimestre 1."
          : "Debe completar los Trimestres 1 y 2 antes de ingresar el Trimestre 3."
      );
      return;
    }

    const valorActual =
      trimestre === 1
        ? estudiante.trim1
        : trimestre === 2
        ? estudiante.trim2
        : estudiante.trim3;

    setNotaEdit({
      estudianteId: estudiante.estudianteId,
      nombresCompletos: estudiante.nombresCompletos,
      trimestre,
      valorActual,
      registroId: estudiante.registroId,
    });
  };

  // Guardar nota (una sola función, limpia)
  const guardarNotaTrimestre = async (nuevaNota: number) => {
    if (!notaEdit || !filtro.idMateria) {
      alert("Error: faltan datos para guardar");
      return;
    }

    try {
      // Payload LIMPIO: solo el trimestre que se está editando
      const payload = {
        [`trim${notaEdit.trimestre}`]: nuevaNota,
      };

      if (notaEdit.registroId) {
        console.log(notaEdit.registroId);
        console.log(payload);
        // PATCH: actualizar solo el campo del trimestre
        await api.patch(`/calificaciones/ActualizarCalificacion/${notaEdit.registroId}`, payload);
      } else {
        console.log(payload);
        // POST: crear nuevo registro completo
        await api.post("/calificaciones/CrearCalificacion", {
          idMateria: Number(filtro.idMateria),
          idEstudiante: notaEdit.estudianteId,
          anioEscolar: anioEscolarActual,
          ...payload, // trim1, trim2 o trim3 según corresponda
        });
      }

      alert("Nota guardada exitosamente");
      setNotaEdit(null);
      cargarCalificaciones();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error al guardar la nota");
    }
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
        Calificaciones por Trimestre
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        gap={3}
        flexWrap="wrap"
        sx={{ mb: 4 }}
      >
        <TextField
          select
          label="Seleccionar Curso"
          value={filtro.idCurso}
          onChange={handleCursoChange}
          sx={{ minWidth: 280 }}
        >
          {cursosDocente.map((c) => (
            <MenuItem key={c.idCurso} value={c.idCurso}>
              {c.nombre} - {c.paralelo}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Seleccionar Materia"
          value={filtro.idMateria}
          onChange={handleMateriaChange}
          disabled={!filtro.idCurso}
          sx={{ minWidth: 280 }}
        >
          {materiasCurso.map((m) => (
            <MenuItem key={m.idMateria} value={m.idMateria}>
              {m.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : calificaciones.length === 0 && filtro.idCurso && filtro.idMateria ? (
        <Typography align="center" color="textSecondary" sx={{ mt: 6 }}>
          No hay estudiantes inscritos en este curso/materia o no se han cargado
          las calificaciones.
        </Typography>
      ) : (
        <TableCalificacionTrimestral
          data={calificaciones}
          onEditarNota={abrirEdicionNota}
        />
      )}

      <FormNotaTrimestre
        open={!!notaEdit}
        onClose={() => setNotaEdit(null)}
        notaEdit={notaEdit}
        onGuardar={guardarNotaTrimestre}
      />
    </>
  );
}
