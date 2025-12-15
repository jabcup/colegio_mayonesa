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

export interface AsignacionDocente {
  idAsignacion: number;
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

interface BackAsignacionDocente {
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

export default function FormAsistencia({ open, onClose, onCreate }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [estudiantesCurso, setEstudiantesCurso] = useState<Estudiante[]>([]);
  const [asignacionesCurso, setAsignacionesCurso] = useState<AsignacionDocente[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    idCurso: "",
    idAsignacion: "",
    idEstudiante: "",
    asistencia: "presente",
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
    setForm({ ...form, idCurso, idAsignacion: "", idEstudiante: "" });

    const idDocente = 4;

    setLoading(true);
    try {
      const estudiantesRes = await api.get(`/estudiante-curso/estudiantes-por-curso/${idCurso}`);
      const estudiantesMap = (estudiantesRes.data as BackEstudianteCurso[]).map(
        (ec) => ({
          id: ec.estudiante.id,
          nombres: ec.estudiante.nombres,
          apellidoPat: ec.estudiante.apellidoPat,
          apellidoMat: ec.estudiante.apellidoMat,
        })
      );

      setEstudiantesCurso(estudiantesMap);

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
      alert("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleAsignacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idAsignacion = e.target.value;
    setForm({ ...form, idAsignacion, idEstudiante: "" });
  };

  const handleSubmit = () => {
    const payload = {
      idAsignacion: Number(form.idAsignacion),
      idEstudiante: Number(form.idEstudiante),
      asistencia: form.asistencia,
    };

    console.log("Payload enviado:", payload);
    onCreate(payload);

    setForm({
      idCurso: "",
      idAsignacion: "",
      idEstudiante: "",
      asistencia: "presente",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Crear Asistencia</DialogTitle>
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
                  value={c.idCurso.toString()}
                >
                  {c.nombre} - {c.paralelo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Materia"
              name="idAsignacion"
              value={form.idAsignacion}
              onChange={handleAsignacionChange}
              disabled={!form.idCurso}
            >
              {asignacionesCurso.map((m) => (
                <MenuItem
                  key={m.idAsignacion}
                  value={m.idAsignacion.toString()}
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
              select
              label="Asistencia"
              name="asistencia"
              value={form.asistencia}
              onChange={handleChange}
            >
              <MenuItem value="presente">Presente</MenuItem>
              <MenuItem value="falta">Falta</MenuItem>
              <MenuItem value="ausente">Ausente</MenuItem>
              <MenuItem value="justificativo">Justificativo</MenuItem>
            </TextField>
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
          Registrar Asistencia
        </Button>
      </DialogActions>
    </Dialog>
  );
}