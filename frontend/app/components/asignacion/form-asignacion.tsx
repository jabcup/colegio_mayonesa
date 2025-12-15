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
  modoEdicion: boolean;
  valoresIniciales?: {
    idDocente?: number;
    idMateria?: number;
  };
  dia: string;
  idHorario: number;
  idAsignacionActual?: number;
}

export default function FormAsignacion({
  open,
  onClose,
  onGuardar,
  dia,
  idHorario,
  modoEdicion,
  valoresIniciales,
  idAsignacionActual,
}: Props) {
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [materias, setMaterias] = useState<Materias[]>([]);
  const [idMateria, setIdMateria] = useState<number>(0);
  const [docentes, setDocentes] = useState<Docentes[]>([]);
  const [idDocente, setIdDocente] = useState<number>(0);

  useEffect(() => {
    if (!open) return;

    cargarMaterias();

    if (modoEdicion && idAsignacionActual) {
      cargarDocentesDisponibles();
    } else if (!modoEdicion) {
      cargarDocentesDisponibles();
    }
  }, [open, dia, idHorario, modoEdicion, idAsignacionActual]);

  useEffect(() => {
    if (open && modoEdicion && valoresIniciales && docentes.length > 0) {
      setIdDocente(valoresIniciales.idDocente ?? 0);
      setIdMateria(valoresIniciales.idMateria ?? 0);
    }

    if (open && !modoEdicion) {
      setIdDocente(0);
      setIdMateria(0);
    }
  }, [open, modoEdicion, valoresIniciales, docentes]);

  const cargarMaterias = async () => {
    setLoadingMaterias(true);
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
      setLoadingMaterias(false);
    }
  };

  const cargarDocentesDisponibles = async () => {
    setLoadingDocentes(true);
    try {
      const docentesRes = await api.get("/personal/DocentesDisponibles", {
        params: {
          dia,
          idHorario,
          idAsignacionActual: modoEdicion ? idAsignacionActual : undefined,
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
      alert("Error al cargar los datos");
    } finally {
      setLoadingDocentes(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {modoEdicion
            ? "Editar Asignacion"
            : "Asignar una Materia a un Docente"}
        </DialogTitle>
        <DialogContent>
          {loadingMaterias ? (
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

          {loadingDocentes ? (
            <CircularProgress />
          ) : (
            <TextField
              select
              fullWidth
              label="Docente"
              value={docentes.some((d) => d.id === idDocente) ? idDocente : ""}
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
