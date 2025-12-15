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
import { useEffect, useState } from "react";

interface Materias {
  id: number;
  nombre: string;
  fechaCreacion: string;
  estado: string;
}

interface Docentes {
    id: number;
    nombre: string;
    correo: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onGuardar: (data: { idDocente: number; idMateria: number }) => void;
  dia: string;
  idHorario: number;
}

export default function FormAsignacion({ open, onClose, onGuardar, dia, idHorario }: Props) {
  const [loading, setLoading] = useState(false);
  const [materias, setMaterias] = useState<Materias[]>([]);
  const [idMateria, setIdMateria] = useState<number>(0);
  const [docentes, setDocentes] = useState<Docentes[]>([]);
  const [idDocente, setIdDocente] = useState<number>(0);

  useEffect(() => {
    if (open) cargarMaterias();
    if (open) cargarDocentesDisponibles();
  }, [open, dia, idHorario]);

  const cargarMaterias = async () => {
    setLoading(true);
    try {
      const materiasRes = await api.get("/materias/MostrarMaterias");
      const materiasMap = (materiasRes.data as Materias[]).map((a) => ({
        id: a.id,
        nombre: a.nombre,
        fechaCreacion: a.fechaCreacion,
        estado: a.estado,
      }));
      setMaterias(materiasMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarDocentesDisponibles = async () => {
    setLoading(true);
    try {
      const docentesRes = await api.get('/personal/DocentesDisponibles', {
        params: {
          dia,
          idHorario,
        },
      });
      const docentesMap = (docentesRes.data as Docentes[]).map((a) => ({
        id: a.id,
        nombre: a.nombre,
        correo: a.correo,
      }));
      setDocentes(docentesMap);
    } catch (err) {
      console.error(err);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Asignar una Materia a un Docente</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <TextField
              select
              fullWidth
              label="Materia"
              value={idMateria}
              onChange={(e) => setIdMateria(Number(e.target.value))}
            >
              {materias.map((materia) => (
                <MenuItem key={materia.id} value={materia.id}>
                  {materia.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {loading ? (
            <CircularProgress />
          ) : (
            <TextField
              select
              fullWidth
              label="Docente"
              value={idDocente}
              onChange={(e) => setIdDocente(Number(e.target.value))}
            >
              {docentes.map((docente) => (
                <MenuItem key={docente.id} value={docente.id}>
                  {docente.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!idMateria || !idDocente}
            onClick={() => onGuardar({ idMateria, idDocente })}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
