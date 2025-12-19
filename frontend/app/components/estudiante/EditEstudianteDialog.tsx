"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { api } from "@/app/lib/api";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion: string;
  correo: string;
  correo_institucional: string;
  rude: string;
  direccion: string;
  telefono_referencia: string;
  fecha_nacimiento: string;
  sexo: string;
  nacionalidad: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  open: boolean;
  estudiante: Estudiante | null; // Cambiado de EstudianteConTutores a Estudiante
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditEstudianteDialog({ open, estudiante, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    identificacion: "",
    correo: "",
    direccion: "",
    telefono_referencia: "",
    fecha_nacimiento: "",
    sexo: "",
    nacionalidad: "",
  });

  useEffect(() => {
    if (estudiante) {
      setForm({
        nombres: estudiante.nombres, // Cambiado de estudiante.estudiante.nombres
        apellidoPat: estudiante.apellidoPat,
        apellidoMat: estudiante.apellidoMat,
        identificacion: estudiante.identificacion,
        correo: estudiante.correo,
        direccion: estudiante.direccion,
        telefono_referencia: estudiante.telefono_referencia,
        fecha_nacimiento: estudiante.fecha_nacimiento,
        sexo: estudiante.sexo,
        nacionalidad: estudiante.nacionalidad,
      });
    }
  }, [estudiante]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!estudiante) return;

    setLoading(true);
    try {
      await api.put(`/estudiante/editar/${estudiante.id}`, form);
      alert("Estudiante actualizado exitosamente");
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Estudiante</DialogTitle>

      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="Nombres"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido Paterno"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido Materno"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CI"
              name="identificacion"
              value={form.identificacion}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              label="Teléfono de Referencia"
              name="telefono_referencia"
              value={form.telefono_referencia}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Fecha Nacimiento"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Sexo"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
            </TextField>
            <TextField
              label="Nacionalidad"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}