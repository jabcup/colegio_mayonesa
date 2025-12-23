"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useMemo } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (horario: string) => void;
}

function generarHorarios() {
  const horarios: string[] = [];

  let minutosInicio = 8 * 60; // 08:00
  const minutosFin = 19 * 60; // 19:00
  const intervalo = 40;

  while (minutosInicio + intervalo <= minutosFin) {
    const inicioHora = String(Math.floor(minutosInicio / 60)).padStart(2, "0");
    const inicioMin = String(minutosInicio % 60).padStart(2, "0");

    const fin = minutosInicio + intervalo;
    const finHora = String(Math.floor(fin / 60)).padStart(2, "0");
    const finMin = String(fin % 60).padStart(2, "0");

    horarios.push(`${inicioHora}:${inicioMin} – ${finHora}:${finMin}`);

    minutosInicio += intervalo;
  }

  return horarios;
}

export default function HorariosForm({ open, onClose, onCreate }: Props) {
  const [horario, setHorario] = useState("");

  const horarios = useMemo(() => generarHorarios(), []);

  const handleSubmit = () => {
    if (!horario) return;
    onCreate(horario);
    setHorario("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Crear Nuevo Horario</DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="horario-label">Horario</InputLabel>
          <Select
            labelId="horario-label"
            label="Horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          >
            {horarios.map((h) => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={!horario}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
