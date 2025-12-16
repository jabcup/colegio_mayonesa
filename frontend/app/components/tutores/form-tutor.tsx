"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Tutor } from "./table-tutores";
import { api } from "@/app/lib/api";

interface Docente {
  id: number;
  nombre: string;
}

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
}

interface Props {
  open: boolean;
  onClose: () => void;

  isEdit: boolean;
  selectedTutor: Tutor | null;

  onCreate: (data: { idPersonal: number; idCurso: number }) => void;
  onUpdate: (data: { idPersonal: number; idCurso: number }) => void;
}

export default function FormTutor({
  open,
  onClose,
  isEdit,
  selectedTutor,
  onCreate,
  onUpdate,
}: Props) {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [form, setForm] = useState({
    idPersonal: 0,
    idCurso: 0,
  });

  // Cargar combos
  useEffect(() => {
    api.get("/personal/Docentes").then((res) => setDocentes(res.data));
    api.get("/cursos/CursosActivos").then((res) => setCursos(res.data));
  }, []);

  // Precargar o limpiar
  useEffect(() => {
    if (isEdit && selectedTutor) {
      setForm({
        idPersonal: selectedTutor.personal.id,
        idCurso: selectedTutor.curso.id,
      });
    } else {
      setForm({ idPersonal: 0, idCurso: 0 });
    }
  }, [isEdit, selectedTutor]);

  const handleSubmit = () => {
    if (isEdit) {
      onUpdate(form);
    } else {
      onCreate(form);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar Tutor" : "Asignar Tutor"}</DialogTitle>

      <DialogContent>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Docente"
          value={form.idPersonal}
          onChange={(e) =>
            setForm({ ...form, idPersonal: Number(e.target.value) })
          }
        >
          {docentes.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          margin="dense"
          label="Curso"
          value={form.idCurso}
          onChange={(e) =>
            setForm({ ...form, idCurso: Number(e.target.value) })
          }
        >
          {cursos.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nombre} {c.paralelo} - {c.gestion}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Actualizar" : "Asignar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
