"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  //Edit
  selectedCurso: Curso | null;

  onCreate: (data: {
    nombre: string;
    paralelo: string;
    gestion: number;
    capacidad: number;
  }) => void;
  onUpdate?: (data: {
    nombre: string;
    paralelo: string;
    gestion: number;
    capacidad: number;
  }) => void;
}

export interface UpdateCursoDto {
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
}

export default function FormCurso({
  open,
  onClose,
  onCreate,
  onUpdate,
  selectedCurso,
}: Props) {
  const [form, setForm] = useState({
    nombre: "",
    paralelo: "",
    gestion: 0,
    capacidad: 0,
  });

  useEffect(() => {
    if (selectedCurso) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nombre: selectedCurso.nombre,
        paralelo: selectedCurso.paralelo,
        gestion: selectedCurso.gestion,
        capacidad: selectedCurso.capacidad,
      });
    } else {
      setForm({
        nombre: "",
        paralelo: "",
        gestion: 0,
        capacidad: 0,
      });
    }
  }, [selectedCurso]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.gestion < 1990 || form.gestion > 3000) {
      alert("La gestion debe estar entre 1990 y 3000");
      return;
    }

    if (form.paralelo.length !== 1 || !/^[a-zA-Z]+$/.test(form.paralelo) || form.paralelo !== form.paralelo.toUpperCase()) {
      alert("El paralelo debe tener una sola letra");
      return;
    }

    if (selectedCurso && onUpdate) {
      // Modo EDITAR
      onUpdate({
        nombre: form.nombre,
        paralelo: form.paralelo,
        gestion: form.gestion,
        capacidad: form.capacidad,
      });
      return;
    }

    const payload = {
      ...form,
    };

    console.log("Payload enviado:", payload);

    onCreate(payload);

    setForm({
      nombre: "",
      paralelo: "",
      gestion: 0,
      capacidad: 0,
    });

    onClose();
  };

  const isUpdate = Boolean(selectedCurso);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isUpdate ? "Editar Curso" : "Crear Curso"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nombre"
          label="Nombre"
          type="text"
          fullWidth
          value={form.nombre}
          onChange={handleChange}
        />
        <TextField
        select
          margin="dense"
          name="paralelo"
          label="Paralelo"
          type="text"
          fullWidth
          value={form.paralelo}
          onChange={handleChange}
          inputProps={{ maxLength: 1 }}
          error={
            form.paralelo !== "" && !/^[A-Z]$/.test(form.paralelo) // solo una letra mayúscula
          }
          helperText={
            form.paralelo !== "" && !/^[A-Z]$/.test(form.paralelo)
              ? "El paralelo debe ser una letra MAYÚSCULA entre A y Z"
              : ""
          }
        />

        <TextField
          margin="dense"
          name="gestion"
          label="Gestion"
          type="number"
          fullWidth
          value={form.gestion}
          onChange={handleChange}
          inputProps={{ min: 1990, max: 3000 }}
          error={
            form.gestion !== 0 &&
            (Number(form.gestion) < 1990 || Number(form.gestion) > 3000)
          }
          helperText={
            form.gestion !== 0 &&
            (Number(form.gestion) < 1990 || Number(form.gestion) > 3000)
              ? "Colocar un año de gestion aceptable mayor a 1990"
              : ""
          }
        />
        <TextField
          margin="dense"
          name="capacidad"
          label="Capacidad"
          type="number"
          fullWidth
          value={form.capacidad}
          onChange={handleChange}
        />
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
          {isUpdate ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
