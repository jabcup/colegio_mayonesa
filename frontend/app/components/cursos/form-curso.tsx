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
  //Edit
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
    idParalelo: 0,
    gestion: 0,
    capacidad: 0,
  });

  const [paralelos, setParalelos] = useState<Paralelos[]>([]);

  const cargarParalelos = async() => {
    try {
      const res = await api.get(`/paralelos/MostrarParalelos`);;

      setParalelos(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los paralelos");
    }
  }

  useEffect(() => {
    if (selectedCurso) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        gestion: 0,
        capacidad: 0,
      });
    }
  }, [selectedCurso]);

  useEffect(() => {
    cargarParalelos();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idParalelo" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (form.gestion < 1990 || form.gestion > new Date().getFullYear()) {
      alert("La gestion debe estar entre 1990 y el año actual");
      return;
    }

    const payload = {
      nombre: form.nombre,
      idParalelo: form.idParalelo,
      gestion: form.gestion,
      capacidad: form.capacidad,
    };

    console.log("Payload enviado:", payload);

    if (selectedCurso && onUpdate) {
      // Modo EDITAR
      onUpdate({
        nombre: form.nombre,
        idParalelo: form.idParalelo,
        gestion: form.gestion,
        capacidad: form.capacidad,
      });
      return;
    }


    onCreate(payload);

    setForm({
      nombre: "",
      idParalelo: 0,
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
          name="idParalelo"
          label="Paralelo"
          fullWidth
          value={form.idParalelo}
          onChange={handleChange}
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
          label="Gestion"
          type="number"
          fullWidth
          value={form.gestion}
          onChange={handleChange}
          inputProps={{ min: 1990, max: new Date().getFullYear() }}
          error={
            form.gestion !== 0 &&
            (Number(form.gestion) < 1990 || Number(form.gestion) > new Date().getFullYear())
          }
          helperText={
            form.gestion !== 0 &&
            (Number(form.gestion) < 1990 || Number(form.gestion) > new Date().getFullYear())
              ? "Colocar un año de gestion aceptable mayor a 1990 y menor al actual"
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
