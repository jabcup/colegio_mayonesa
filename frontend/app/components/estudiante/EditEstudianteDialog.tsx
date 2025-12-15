"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  estudiante: any | null;
  onUpdated: () => void;
}

export default function EditEstudianteDialog({
  open,
  onClose,
  estudiante,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (estudiante) {
      setForm({
        nombres: estudiante.estudiante.nombres,
        apellidoPat: estudiante.estudiante.apellidoPat,
        apellidoMat: estudiante.estudiante.apellidoMat,
        correo: estudiante.estudiante.correo,
        direccion: estudiante.estudiante.direccion,
        telefono_referencia: estudiante.estudiante.telefono_referencia,
        sexo: estudiante.estudiante.sexo,
        nacionalidad: estudiante.estudiante.nacionalidad,
      });
    }
  }, [estudiante]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.put(
        `/estudiante/editar/${estudiante.estudiante.id}`,
        form
      );

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Estudiante</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
        />
        <TextField
          label="Apellido Paterno"
          name="apellidoPat"
          value={form.apellidoPat}
          onChange={handleChange}
        />
        <TextField
          label="Apellido Materno"
          name="apellidoMat"
          value={form.apellidoMat}
          onChange={handleChange}
        />
        <TextField
          label="Correo"
          name="correo"
          value={form.correo}
          onChange={handleChange}
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
        />
        <TextField
          label="Teléfono"
          name="telefono_referencia"
          value={form.telefono_referencia}
          onChange={handleChange}
        />
        <TextField
          label="Sexo"
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
        />
        <TextField
          label="Nacionalidad"
          name="nacionalidad"
          value={form.nacionalidad}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
