"use client";

import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Curso {
  id: number;
  nombre: string;
  paralelo: Paralelos;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface Paralelos {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCurso: Curso | null;
  onCreate: (data: {
    nombre: string;
    idParalelo: number;
    gestion: number;
    capacidad: number;
  }) => void;
  onUpdate?: (data: {
    nombre: string;
    idParalelo: number;
    gestion: number;
    capacidad: number;
  }) => void;
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
    idParalelo: 0,
    gestion: new Date().getFullYear(), // Valor por defecto: año actual
    capacidad: 15, // Valor sugerido razonable
  });

  const [paralelos, setParalelos] = useState<Paralelos[]>([]);
  const [errors, setErrors] = useState({
    nombre: false,
    idParalelo: false,
    gestion: false,
    capacidad: false,
  });

  const cargarParalelos = async () => {
    try {
      const res = await api.get(`/paralelos/MostrarParalelos`);
      setParalelos(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los paralelos");
    }
  };

  useEffect(() => {
    if (selectedCurso) {
      setForm({
        nombre: selectedCurso.nombre,
        idParalelo: selectedCurso.paralelo.id,
        gestion: selectedCurso.gestion,
        capacidad: selectedCurso.capacidad,
      });
    } else {
      setForm({
        nombre: "",
        idParalelo: 0,
        gestion: new Date().getFullYear(),
        capacidad: 15,
      });
    }
    setErrors({ nombre: false, idParalelo: false, gestion: false, capacidad: false });
  }, [selectedCurso]);

  useEffect(() => {
    cargarParalelos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numValue = name === "idParalelo" || name === "gestion" || name === "capacidad"
      ? Number(value)
      : value;

    setForm((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  // Validación en tiempo real
  const validateForm = () => {
    const newErrors = {
      nombre: form.nombre.trim() === "",
      idParalelo: form.idParalelo === 0,
      gestion: form.gestion < 0,
      capacidad: form.capacidad < 1 || form.capacidad > 20,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // No hace nada si hay errores
    }

    const payload = {
      nombre: form.nombre.trim(),
      idParalelo: form.idParalelo,
      gestion: form.gestion,
      capacidad: form.capacidad,
    };

    if (selectedCurso && onUpdate) {
      onUpdate(payload);
    } else {
      onCreate(payload);
      // Resetear solo en creación
      setForm({
        nombre: "",
        idParalelo: 0,
        gestion: new Date().getFullYear(),
        capacidad: 15,
      });
    }
    onClose();
  };

  const isUpdate = Boolean(selectedCurso);

  // Generar opciones de 1 a 20 para capacidad
  const capacidadOptions = Array.from({ length: 16 }, (_, i) => i + 5);

  const isFormValid = form.nombre.trim() !== "" &&
                      form.idParalelo !== 0 &&
                      form.gestion >= 2000 &&
                      form.gestion <= 2100 &&
                      form.capacidad >= 5 &&
                      form.capacidad <= 20;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isUpdate ? "Editar Curso" : "Crear Curso"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nombre"
          label="Nombre del curso"
          type="text"
          fullWidth
          value={form.nombre}
          onChange={handleChange}
          error={errors.nombre}
          helperText={errors.nombre ? "El nombre es obligatorio" : ""}
        />

        <TextField
          select
          margin="dense"
          name="idParalelo"
          label="Paralelo"
          fullWidth
          value={form.idParalelo}
          onChange={handleChange}
          error={errors.idParalelo}
          helperText={errors.idParalelo ? "Selecciona un paralelo" : ""}
        >
          <MenuItem value={0} disabled>
            Seleccione un paralelo
          </MenuItem>
          {paralelos.map((paralelo) => (
            <MenuItem key={paralelo.id} value={paralelo.id}>
              {paralelo.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          margin="dense"
          name="gestion"
          label="Gestión (año)"
          type="number"
          fullWidth
          value={form.gestion}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          error={errors.gestion}
          helperText={errors.gestion ? "La gestión no puede ser negativa" : "Ej: 2025"}
        />

        <TextField
          select
          margin="dense"
          name="capacidad"
          label="Capacidad máxima"
          fullWidth
          value={form.capacidad}
          onChange={handleChange}
          error={errors.capacidad}
          helperText={errors.capacidad ? "Debe ser entre 1 y 20" : "Máximo 20 estudiantes"}
        >
          {capacidadOptions.map((num) => (
            <MenuItem key={num} value={num}>
              {num} estudiantes
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid} // ← Desactiva si hay errores
        >
          {isUpdate ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}