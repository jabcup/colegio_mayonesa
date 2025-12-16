"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

interface Curso {
  id: number;
  nombre: string;
  nivel?: string;
  paralelo?: string;
}

interface AvisoExisting {
  id: number;
  asunto: string;
  mensaje: string;
  Curso: Curso;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  avisoToEdit?: AvisoExisting | null;
}

export default function FormAviso({ open, onClose, onSuccess, avisoToEdit }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const idPersonal = 1;

  const isEditMode = !!avisoToEdit;

  useEffect(() => {
    if (open) {
      cargarCursos();

      if (isEditMode && avisoToEdit) {
        setSelectedCurso(avisoToEdit.Curso);
        setAsunto(avisoToEdit.asunto);
        setMensaje(avisoToEdit.mensaje);
      } else {
        // Modo crear
        setSelectedCurso(null);
        setAsunto("");
        setMensaje("");
      }
    }
  }, [open, avisoToEdit]);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos/MostrarCursos");
      setCursos(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCurso || !asunto.trim() || !mensaje.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const payload = {
      idCurso: selectedCurso.id,
      idPersonal,
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
    };

    try {
      if (isEditMode) {
        await api.put(`/avisos/${avisoToEdit!.id}`, payload);
        alert("Aviso actualizado correctamente");
      } else {
        await api.post("/avisos/CrearAviso", payload);
        alert("Aviso enviado correctamente");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Error al ${isEditMode ? "actualizar" : "enviar"} el aviso`);
    }
  };

  const getOptionLabel = (option: Curso) =>
    `${option.nombre} ${option.nivel ? `- ${option.nivel}` : ""} ${option.paralelo ? option.paralelo : ""}`.trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Editar Aviso" : "Enviar Nuevo Aviso al Curso"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Autocomplete
              options={cursos}
              getOptionLabel={getOptionLabel}
              value={selectedCurso}
              onChange={(_event, newValue) => setSelectedCurso(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar curso"
                  placeholder="Escribe nombre, nivel o paralelo..."
                  required
                />
              )}
              noOptionsText="No se encontraron cursos"
              disabled={isEditMode}
            />

            <TextField
              label="Asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              multiline
              rows={5}
              fullWidth
              required
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "Guardar Cambios" : "Enviar Aviso"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}