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

interface Paralelo {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  //Edit
  selectedParalelo: Paralelo | null;

  onCreate: (data: { nombre: string }) => void;
  onUpdate?: (data: { nombre: string }) => void;
}

export interface UpdateParaleloDto {
  nombre: string;
}

export default function FormParalelo({
  open,
  onClose,
  onCreate,
  onUpdate,
  selectedParalelo,
}: Props) {

  const [form, setForm] = useState({
    nombre: "",
  });

  useEffect(() => {
    if (selectedParalelo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nombre: selectedParalelo.nombre,
      });
    } else {
      setForm({
        nombre: "",
      });
    }
  }, [selectedParalelo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.nombre.length !== 1 || !/^[a-zA-Z]+$/.test(form.nombre) || form.nombre !== form.nombre.toUpperCase()) {
      alert("El paralelo debe tener una sola letra");
      return;
    }
    if (selectedParalelo && onUpdate) {
      // Modo EDITAR
      onUpdate({
        nombre: form.nombre,
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
    });

    onClose();
  };

  const isUpdate = Boolean(selectedParalelo);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isUpdate ? "Editar Paralelo" : "Crear Paralelo"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="nombre"
          label="Paralelo"
          type="text"
          fullWidth
          value={form.nombre}
          onChange={handleChange}
          inputProps={{ maxLength: 1 }}
          error={
            form.nombre !== "" && !/^[A-Z]$/.test(form.nombre) // solo una letra mayúscula
          }
          helperText={
            form.nombre !== "" && !/^[A-Z]$/.test(form.nombre)
              ? "El paralelo debe ser una letra MAYÚSCULA entre A y Z"
              : ""
          }
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
