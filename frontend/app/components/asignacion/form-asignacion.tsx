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
import { Autocomplete } from "@mui/material";

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
  onGuardar: (data: {
    idDocente: number;
    idMateria: number;
    nombreMateria: string;
    nombreDocente: string;
  }) => void;
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

  const handleGuardarClick = () => {
    const selectedMateria = materias.find((m) => m.id === idMateria) || null;
    const selectedDocente = docentes.find((d) => d.id === idDocente) || null;

    if (!selectedMateria || !selectedDocente) return;

    onGuardar({
      idMateria: selectedMateria.id,
      idDocente: selectedDocente.id,
      nombreMateria: selectedMateria.nombre,        // ← aquí va el nombre real
      nombreDocente: selectedDocente.nombre         // ← aquí va el nombre real
    });

    onClose();
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
            <Autocomplete
              options={materias}
              getOptionLabel={(option) => option.nombre}
              value={materias.find((m) => m.id === idMateria) || null}
              onChange={(_, newValue) => {
                setIdMateria(newValue ? newValue.id : 0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Materia"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          )}

          {loadingDocentes ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              options={docentes}
              getOptionLabel={(option) => option.nombre}
              value={docentes.find((d) => d.id === idDocente) || null}
              onChange={(_, newValue) => {
                setIdDocente(newValue ? newValue.id : 0);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Docente"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!idMateria || !idDocente}
            onClick={handleGuardarClick}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
