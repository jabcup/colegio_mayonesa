"use client";

import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { getAuthData } from "@/app/lib/auth";

export interface UpdateCalificacionDto {
  calificacion: number;
}

export interface CalificacionFiltrada {
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

export interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

export interface MateriaDocente {
  idMateria: number;
  nombre: string;
}

export interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
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

interface BackEstudianteCurso {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  //Edit
  selectedCalificacion: CalificacionFiltrada | null;

  onCreate: (data: {
    idMateria: number;
    idEstudiante: number;
    calificacion: number;
  }) => void;
  onUpdate?: (data: { calificacion: number }) => void;
}

export default function FormCalificacion({
  open,
  onClose,
  onCreate,
  onUpdate,
  selectedCalificacion,
}: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [estudiantesCurso, setEstudiantesCurso] = useState<Estudiante[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [loading, setLoading] = useState(false);

  const { rol, idPersonal } = getAuthData();

  const [form, setForm] = useState({
    idCurso: "",
    idMateria: "",
    idEstudiante: "",
    calificacion: "",
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCalificacion) {
      setForm({
        idCurso: "",
        idMateria: selectedCalificacion.materia.id.toString(),
        idEstudiante: selectedCalificacion.estudiante.id.toString(),
        calificacion: selectedCalificacion.calificacion.toString(),
      });
    } else {
      setForm({
        idCurso: "",
        idMateria: "",
        idEstudiante: "",
        calificacion: "",
      });
    }
  }, [selectedCalificacion]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const idDocente = idPersonal;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCursoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idCurso = e.target.value;
    setForm({ ...form, idCurso, idMateria: "", idEstudiante: "" });

    const idDocente = idPersonal;

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

      setEstudiantesCurso([]);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleMateriaChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const idMateria = e.target.value;
    setForm({ ...form, idMateria, idEstudiante: "" });

    const idCurso = form.idCurso;
    if (!idCurso) return;

    setLoading(true);

    try {
      const estudiantesRes = await api.get(
        `/estudiante-curso/no-calificados?idCurso=${idCurso}&idMateria=${idMateria}`
      );

      const estudiantesMap = (estudiantesRes.data as BackEstudianteCurso[]).map(
        (ec) => ({
          id: ec.id,
          nombres: ec.nombres,
          apellidoPat: ec.apellidoPat,
          apellidoMat: ec.apellidoMat,
        })
      );

      setEstudiantesCurso(estudiantesMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los estudiantes no calificados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (Number(form.calificacion) < 0 || Number(form.calificacion) > 100) {
      alert("La calificación debe estar entre 0 y 100");
      return;
    }

    if (selectedCalificacion && onUpdate) {
      // Modo EDITAR
      onUpdate({
        calificacion: Number(form.calificacion),
      });
      return;
    }

    if (!form.idCurso || !form.idMateria || !form.idEstudiante) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const payload = {
      idMateria: Number(form.idMateria),
      idEstudiante: Number(form.idEstudiante),
      calificacion: Number(form.calificacion),
    };

    console.log("Payload enviado:", payload);
    onCreate(payload);

    cargarDatos();

    setForm({
      idCurso: "",
      idMateria: "",
      idEstudiante: "",
      calificacion: "",
    });
  };

  const isEditing = Boolean(selectedCalificacion);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditing ? "Editar Calificación" : "Registrar Calificación"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Curso"
              name="idCurso"
              value={form.idCurso}
              onChange={handleCursoChange}
              disabled={isEditing}
            >
              {cursosDocente.map((c) => (
                <MenuItem key={c.idCurso} value={c.idCurso.toString()}>
                  {c.nombre} - {c.paralelo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Materia"
              name="idMateria"
              value={form.idMateria}
              onChange={handleMateriaChange}
              disabled={!form.idCurso || isEditing}
            >
              {materiasCurso.map((m) => (
                <MenuItem key={m.idMateria} value={m.idMateria.toString()}>
                  {m.nombre}
                </MenuItem>
              ))}
            </TextField>

            {/* <TextField
              select
              label="Estudiante"
              name="idEstudiante"
              value={form.idEstudiante}
              onChange={handleChange}
              disabled={!form.idCurso || isEditing}
            >
              {estudiantesCurso.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.nombres} {e.apellidoPat} {e.apellidoMat}
                </MenuItem>
              ))}
            </TextField> */}

            <Autocomplete
              options={estudiantesCurso}
              getOptionLabel={(option) =>
                `${option.apellidoPat} ${option.apellidoMat}, ${option.nombres}`
              }
              value={
                estudiantesCurso.find(
                  (e) => e.id.toString() === form.idEstudiante
                ) || null
              }
              onChange={(_, newValue) => {
                setForm({
                  ...form,
                  idEstudiante: newValue ? newValue.id.toString() : "",
                });
              }}
              disabled={!form.idCurso || isEditing}
              renderInput={(params) => (
                <TextField {...params} label="Estudiante" />
              )}
            />

            <TextField
              label="Calificación"
              name="calificacion"
              type="number"
              value={form.calificacion}
              onChange={handleChange}
              inputProps={{
                min: 0,
                max: 100,
              }}
              error={
                form.calificacion !== "" &&
                (Number(form.calificacion) < 0 ||
                  Number(form.calificacion) > 100)
              }
              helperText={
                form.calificacion !== "" &&
                (Number(form.calificacion) < 0 ||
                  Number(form.calificacion) > 100)
                  ? "La calificación debe estar entre 0 y 100"
                  : ""
              }
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          variant="contained"
        >
          {isEditing ? "Actualizar" : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
