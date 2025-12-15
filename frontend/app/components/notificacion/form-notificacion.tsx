"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import Cookies from "js-cookie"

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormNotificacion({ open, onClose, onSuccess }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const idPersonal = Number(Cookies.get('personal_id') ?? 0);

  useEffect(() => {
    if (open) {
      cargarEstudiantes();
      // Reset form
      setSelectedEstudiante(null);
      setAsunto("");
      setMensaje("");
    }
  }, [open]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/estudiante/MostrarEstudiantes");
      setEstudiantes(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEstudiante || !asunto.trim() || !mensaje.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const payload = {
      idEstudiante: selectedEstudiante.id,
      idPersonal,
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
    };

    try {
      await api.post("/notificaciones/CrearNotificacion", payload);
      alert("Notificación enviada correctamente");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al enviar la notificación");
    }
  };

  const getOptionLabel = (option: Estudiante) =>
    `${option.nombres} ${option.apellidoPat} ${option.apellidoMat} ${option.identificacion ? `- ${option.identificacion}` : ""}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Nueva Notificación</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Autocomplete
              options={estudiantes}
              getOptionLabel={getOptionLabel}
              value={selectedEstudiante}
              onChange={(_event, newValue) => setSelectedEstudiante(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar y seleccionar estudiante"
                  placeholder="Escribe nombre o identificación..."
                  required
                />
              )}
              noOptionsText="No se encontraron estudiantes"
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
          Enviar Notificación
        </Button>
      </DialogActions>
    </Dialog>
  );
}