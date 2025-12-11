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

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
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

export default function FormCalificacion({ open, onClose, onCreate }: Props) {
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

//   const handleMateriaChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const idMateria = e.target.value; // mantener string
//     setForm({ ...form, idMateria, idEstudiante: "" });

//     const idDocente = 4;
//     const idCurso = form.idCurso; // usar el curso seleccionado

//     setLoading(true);
//     try {
//       const materiaRes = await api.get(
//         `/asignacion-clases/materias-por-docente-curso/${idDocente}/${Number(
//           idCurso
//         )}`
//       );
//       const materiasMap = (materiaRes.data as BackMateriaDocente[]).map(
//         (m) => ({
//           idMateria: m.id,
//           nombre: m.nombre,
//         })
//       );

//       setMateriasCurso(materiasMap);
//     } catch (err) {
//       console.error(err);
//       alert("Error al cargar las materias");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleMateriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const idMateria = e.target.value;
  setForm({ ...form, idMateria, idEstudiante: "" });
};


  const handleSubmit = () => {
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Crear Calificación</DialogTitle>
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
              disabled={!form.idCurso}
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
              disabled={!form.idCurso}
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
          Registrar Calificacion
        </Button>
      </DialogActions>
    </Dialog>
  );
}
