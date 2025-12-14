"use client";

import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (nombre: string) => void;
}

export default function MateriasForm({ open, onClose, onCreate }: Props) {
  const [nombre, setNombre] = useState("");

  const handleSubmit = () => {
    onCreate(nombre);
    setNombre("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nueva Materia</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Nombre de Materia"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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
