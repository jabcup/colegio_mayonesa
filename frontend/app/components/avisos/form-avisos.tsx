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

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormAviso({ open, onClose, onSuccess }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const idPersonal = 1; // Para pruebas, luego vendrá del login

  useEffect(() => {
    if (open) {
      cargarCursos();
      // Resetear formulario
      setSelectedCurso(null);
      setAsunto("");
      setMensaje("");
    }
  }, [open]);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      // Ajusta la ruta según tu endpoint real para cursos
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
      await api.post("/avisos/CrearAviso", payload);
      alert("Aviso enviado correctamente");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al enviar el aviso");
    }
  };

  const getOptionLabel = (option: Curso) =>
    `${option.nombre} ${option.nivel ? `- ${option.nivel}` : ""} ${option.paralelo ? `${option.paralelo}` : ""}`.trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Nuevo Aviso al Curso</DialogTitle>
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
          Enviar Aviso
        </Button>
      </DialogActions>
    </Dialog>
  );
}