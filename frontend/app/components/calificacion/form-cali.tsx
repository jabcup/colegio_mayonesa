import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";

// Interfaz corregida: registroId ahora puede ser null
interface NotaEdit {
  estudianteId: number;
  nombresCompletos: string;
  trimestre: 1 | 2 | 3;
  valorActual: number | null;
  registroId: number | null;  // ← Aquí está la corrección
}

interface FormNotaTrimestreProps {
  open: boolean;
  onClose: () => void;
  notaEdit: NotaEdit | null;
  onGuardar: (nuevaNota: number) => void;
}

export default function FormNotaTrimestre({
  open,
  onClose,
  notaEdit,
  onGuardar,
}: FormNotaTrimestreProps) {
  const [nota, setNota] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Inicializar al abrir
  const handleOpen = () => {
    if (notaEdit?.valorActual != null) {  // Usa != null para cubrir undefined y null
      setNota(notaEdit.valorActual.toString());
    } else {
      setNota("");
    }
    setError("");
  };

  // Limpiar al cerrar
  const handleClose = () => {
    setNota("");
    setError("");
    onClose();
  };

  const handleGuardar = () => {
    const valor = parseFloat(nota);

    if (isNaN(valor) || nota.trim() === "") {
      setError("Por favor ingrese una nota válida");
      return;
    }

    if (valor < 0 || valor > 100) {
      setError("La nota debe estar entre 0 y 100");
      return;
    }

    onGuardar(valor);
    handleClose();
  };

  const tituloTrimestre = notaEdit
    ? `Trimestre ${notaEdit.trimestre}`
    : "Trimestre";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      onEntered={handleOpen}
    >
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white", py: 2 }}>
        <Typography variant="h6" component="div" align="center">
          Ingresar Nota - {tituloTrimestre}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            <strong>Estudiante:</strong> {notaEdit?.nombresCompletos || "-"}
          </Typography>

          <TextField
            label={`Nota del ${tituloTrimestre} (0 - 100)`}
            value={nota}
            onChange={(e) => {
              setNota(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGuardar();
            }}
            type="number"
            inputProps={{
              min: 0,
              max: 100,
              step: "0.1",
            }}
            fullWidth
            variant="outlined"
            autoFocus
            error={!!error}
            helperText={error}
            sx={{
              maxWidth: 300,
              "& .MuiInputBase-input": { textAlign: "center", fontSize: "1.5rem" },
            }}
          />

          {notaEdit?.valorActual != null && (
            <Typography variant="body2" color="textSecondary">
              Nota actual: <strong>{notaEdit.valorActual.toFixed(1)}</strong>
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          color="primary"
          size="large"
          disabled={!nota.trim()}
        >
          Guardar Nota
        </Button>
      </DialogActions>
    </Dialog>
  );
}