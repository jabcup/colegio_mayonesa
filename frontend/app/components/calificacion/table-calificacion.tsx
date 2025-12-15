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
  Button,
} from "@mui/material";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { AsignacionClase } from "./form-calificacion";

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

interface Props {
  calificaciones: CalificacionFiltrada[];
  onEdit: (calificacion: CalificacionFiltrada) => void;
  onDelete: (id: number) => void;
}

export default function TableCalificacion({
  calificaciones,
  onEdit,
  onDelete,
}: Props) {
  // export
  interface MateriaDocente {
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

  // export default
  function TableCalificacion({ calificaciones }: Props) {
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
        const idDocente = 1;
        const cursosRes = await api.get(
          `/asignacion-clases/por-docente/${idDocente}`
        );
        const cursosMap = (cursosRes.data as BackAsignacionClase[]).map(
          (a) => ({
            idCurso: a.id,
            nombre: a.nombre,
            paralelo: a.paralelo,
          })
        );

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
        )
          // Maybe se arregla con otro merge
          .map((c: CalificacionBackend) => ({
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

    const handleCursoChange = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
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
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Aprobación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calificaciones.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {c.estudiante.nombres} {c.estudiante.apellidoPat}{" "}
                    {c.estudiante.apellidoMat}
                  </TableCell>
                  <TableCell>{c.calificacion}</TableCell>
                  <TableCell>
                    {c.aprobacion ? "Aprobado" : "Reprobado"}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => onEdit(c)}>
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
      </>
    );
  }
}
