"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { api } from "@/app/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  padre: any;
  onUpdated: () => void;
}

export default function EditPadreDialog({
  open,
  onClose,
  padre,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    nombres: padre?.nombres || "",
    apellidoPat: padre?.apellidoPat || "",
    apellidoMat: padre?.apellidoMat || "",
    telefono: padre?.telefono || "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await api.put(`/padres/editar/${padre.id}`, form);
      alert("Padre actualizado");
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al actualizar");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Padre</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} />
        <TextField label="Apellido Paterno" name="apellidoPat" value={form.apellidoPat} onChange={handleChange} />
        <TextField label="Apellido Materno" name="apellidoMat" value={form.apellidoMat} onChange={handleChange} />
        <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
