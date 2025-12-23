"use client";

import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
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
    gestion: new Date().getFullYear(),
    capacidad: 15,
  });

  const [paralelos, setParalelos] = useState<Paralelos[]>([]);

  const cargarParalelos = async () => {
    try {
      const res = await api.get(`/paralelos/MostrarParalelos`);
      setParalelos(res.data);
    } catch (error) {
      console.error(error);
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
  }, [selectedCurso, open]);

  useEffect(() => {
    cargarParalelos();
  }, []);

  // Lista de niveles predefinidos
  const nivelesPrimaria = [
    "1ero de Primaria",
    "2do de Primaria",
    "3ero de Primaria",
    "4to de Primaria",
    "5to de Primaria",
    "6to de Primaria",
  ];

  const nivelesSecundaria = [
    "1ero de Secundaria",
    "2do de Secundaria",
    "3ero de Secundaria",
    "4to de Secundaria",
    "5to de Secundaria",
    "6to de Secundaria",
  ];

  const handleSubmit = () => {
    if (!form.nombre || form.idParalelo === 0 || form.capacidad < 5 || form.capacidad > 20) {
      return;
    }

    const payload = {
      nombre: form.nombre,
      idParalelo: form.idParalelo,
      gestion: form.gestion,
      capacidad: form.capacidad,
    };

    if (selectedCurso && onUpdate) {
      onUpdate(payload);
    } else {
      onCreate(payload);
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

  const capacidadOptions = Array.from({ length: 16 }, (_, i) => i + 5);

  const isFormValid =
    form.nombre !== "" &&
    form.idParalelo !== 0 &&
    form.gestion >= 2000 &&
    form.gestion <= 2100 &&
    form.capacidad >= 5 &&
    form.capacidad <= 20;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.8rem" }}>
        {isUpdate ? "Editar Curso" : "Crear Nuevo Curso"}
      </DialogTitle>

      <DialogContent dividers>
        {/* Combobox para Nivel del Curso */}
        <TextField
          select
          label="Nivel del Curso"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          fullWidth
          margin="dense"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SchoolIcon color="action" />
              </InputAdornment>
            ),
          }}
          helperText="Selecciona el nivel y grado del curso"
        >
          <MenuItem disabled value="">
            <em>Selecciona un nivel</em>
          </MenuItem>

          {/* Grupo Primaria */}
          <MenuItem disabled sx={{ fontWeight: "bold", color: "primary.main" }}>
            PRIMARIA
          </MenuItem>
          {nivelesPrimaria.map((nivel) => (
            <MenuItem key={nivel} value={nivel}>
              {nivel}
            </MenuItem>
          ))}

          {/* Grupo Secundaria */}
          <MenuItem disabled sx={{ fontWeight: "bold", color: "primary.main" }}>
            SECUNDARIA
          </MenuItem>
          {nivelesSecundaria.map((nivel) => (
            <MenuItem key={nivel} value={nivel}>
              {nivel}
            </MenuItem>
          ))}
        </TextField>

        {/* Paralelo */}
        <TextField
          select
          margin="dense"
          label="Paralelo"
          fullWidth
          value={form.idParalelo}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, idParalelo: Number(e.target.value) }))
          }
          helperText="Ej: A, B, C..."
        >
          <MenuItem value={0} disabled>
            Selecciona un paralelo
          </MenuItem>
          {paralelos.map((paralelo) => (
            <MenuItem key={paralelo.id} value={paralelo.id}>
              {paralelo.nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Gestión */}
        <TextField
          margin="dense"
          label="Gestión (año)"
          type="number"
          fullWidth
          value={form.gestion}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, gestion: Number(e.target.value) }))
          }
          inputProps={{ min: 2020, max: 2030 }}
          helperText="Año escolar"
        />

        {/* Capacidad */}
        <TextField
          select
          margin="dense"
          label="Capacidad máxima"
          fullWidth
          value={form.capacidad}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, capacidad: Number(e.target.value) }))
          }
          helperText="Máximo 20 estudiantes"
        >
          {capacidadOptions.map((num) => (
            <MenuItem key={num} value={num}>
              {num} estudiantes
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} size="large">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          size="large"
        >
          {isUpdate ? "Actualizar Curso" : "Crear Curso"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}