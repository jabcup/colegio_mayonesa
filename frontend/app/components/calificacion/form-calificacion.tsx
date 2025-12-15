'use client';

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
import { useEffect, useState } from "react";

export interface UpdateCalificacionDto {
  calificacion: number;
}

// Tipo que representa la fila mostrada en la tabla (y seleccionable para editar)
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
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
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

export default function FormCalificacion({ open, onClose, onCreate, onUpdate, selectedCalificacion }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [estudiantesCurso, setEstudiantesCurso] = useState<Estudiante[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    idCurso: "", // Nuevo: curso seleccionado
    idMateria: "", // Si quieres guardar la clase específica (materia + horario)
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
        idCurso: "", // puedes dejarlo vacío, porque no se usa en edición
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCursoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idCurso = e.target.value;
    setForm({ ...form, idCurso, idMateria: "", idEstudiante: "" });

    const idDocente = 4;

    setLoading(true);
    try {
      const estudiantesRes = await api.get(`/estudiante-curso/${idCurso}`);
      const estudiantesMap = (estudiantesRes.data as BackEstudianteCurso[]).map(
        (ec) => ({
          id: ec.estudiante.id,
          nombres: ec.estudiante.nombres,
          apellidoPat: ec.estudiante.apellidoPat,
          apellidoMat: ec.estudiante.apellidoMat,
        })
      );

      setEstudiantesCurso(estudiantesMap);

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
    setForm({ ...form, idMateria, idEstudiante: "" });
  };

  const handleSubmit = () => {
    if (selectedCalificacion && onUpdate) {
      // Modo EDITAR
      onUpdate({
        calificacion: Number(form.calificacion),
      });
      return;
    }

    const payload = {
      idMateria: Number(form.idMateria),
      idEstudiante: Number(form.idEstudiante),
      calificacion: Number(form.calificacion),
    };

    console.log("Payload enviado:", payload);
    onCreate(payload);

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
                <MenuItem
                  key={c.idCurso}
                  value={c.idCurso.toString()} // mantener string
                >
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
                <MenuItem
                  key={m.idMateria}
                  value={m.idMateria.toString()} // mantener string
                >
                  {m.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
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
            </TextField>

            <TextField
              label="Calificación"
              name="calificacion"
              type="number"
              value={form.calificacion}
              onChange={handleChange}
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
