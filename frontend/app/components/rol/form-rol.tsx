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

interface Rol {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  //Edit
  selectedRol: Rol | null;

  onCreate: (data: { nombre: string }) => void;
  onUpdate?: (data: { nombre: string }) => void;
}

export interface UpdateRolDto {
  nombre: string;
}

export default function FormRol({
  open,
  onClose,
  onCreate,
  onUpdate,
  selectedRol,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
  });

  useEffect(() => {
    if (selectedRol) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nombre: selectedRol.nombre,
      });
    } else {
      setForm({
        nombre: "",
      });
    }
  }, [selectedRol]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (selectedRol && onUpdate) {
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

  const isUpdate = Boolean(selectedRol);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isUpdate ? "Editar Rol" : "Crear Rol"}</DialogTitle>
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
