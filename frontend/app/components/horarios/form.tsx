"use client";

import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (horario: string) => void;
}

export default function HorariosForm({ open, onClose, onCreate }: Props) {
  const [horario, setHorario] = useState("");

  const handleSubmit = () => {
    onCreate(horario);
    setHorario("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nuevo Horario</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Lapso de Tiempo (Horario)"
          type="text"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Crear</Button>
      </DialogActions>
    </Dialog>
  );
}
