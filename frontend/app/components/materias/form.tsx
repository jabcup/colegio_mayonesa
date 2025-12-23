"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  TextField,
  MenuItem,
  InputAdornment,
  ListSubheader,
  CircularProgress,
  Box,
} from "@mui/material";
import { School as SchoolIcon, Edit as EditIcon } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (nombre: string) => Promise<void>;
}

export default function MateriasForm({ open, onClose, onCreate }: Props) {
  const [selectedMateria, setSelectedMateria] = useState<string>(""); // Valor seleccionado en el combobox
  const [nombrePersonalizado, setNombrePersonalizado] = useState(""); // Solo cuando es "Otro"
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Obtenemos el nombre final que se enviará
  const nombreFinal = selectedMateria === "OTRO" ? nombrePersonalizado : selectedMateria;

  // Materias válidas de Bolivia
  const materiasPrimaria = [
    "Comunicación",
    "Matemática",
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Educación Artística",
    "Educación Musical",
    "Educación Física",
    "Formación Personal y Ciudadana",
    "Inglés",
    "Informática",
  ];

  const materiasSecundaria = [
    "Lenguaje y Literatura",
    "Matemática",
    "Física",
    "Química",
    "Biología",
    "Historia",
    "Geografía",
    "Filosofía",
    "Educación Cívica y Ética",
    "Educación Física",
    "Arte",
    "Música",
    "Inglés",
    "Segundo Idioma (Francés/Alemán)",
    "Informática",
    "Emprendimiento y Negocios",
    "Contabilidad",
    "Economía",
    "Tecnología",
  ];

  const handleSelectChange = (value: string) => {
    setSelectedMateria(value);
    if (value !== "OTRO") {
      setNombrePersonalizado(""); // Limpiar si vuelve a una predefinida
    }
    setError(null);
  };

  const handleSubmit = async () => {
    const nombreTrim = nombreFinal.trim();
    if (!nombreTrim) {
      setError("Por favor selecciona una materia o escribe un nombre personalizado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate(nombreTrim);
      // Resetear todo
      setSelectedMateria("");
      setNombrePersonalizado("");
      onClose();
    } catch (err: any) {
      const mensajeBackend = err?.response?.data?.message || err?.message || "";
      if (mensajeBackend.toLowerCase().includes("existe") || mensajeBackend.toLowerCase().includes("duplicate")) {
        setError(`La materia "${nombreTrim}" ya existe`);
      } else {
        setError("Error al crear la materia. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMateria("");
    setNombrePersonalizado("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.8rem", pb: 1 }}>
        Crear Nueva Materia
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3, pb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Mensaje de error */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                borderRadius: 2,
                bgcolor: "error.lighter",
                color: "error.darker",
                "& .MuiAlert-icon": { color: "error.main" },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Combobox siempre presente */}
          <TextField
            select
            label="Selecciona una Materia"
            value={selectedMateria}
            onChange={(e) => handleSelectChange(e.target.value as string)}
            fullWidth
            autoFocus={!selectedMateria || selectedMateria !== "OTRO"}
            disabled={loading}
            variant="outlined"
            SelectProps={{
              MenuProps: {
                PaperProps: { sx: { maxHeight: 400 } },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Elige una materia oficial o 'Otro' para personalizar"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            <MenuItem value="" disabled>
              <em>— Selecciona una opción —</em>
            </MenuItem>

            <ListSubheader sx={{ fontWeight: "bold", bgcolor: "primary.50", color: "primary.main" }}>
              📚 PRIMARIA
            </ListSubheader>
            {materiasPrimaria.map((materia) => (
              <MenuItem key={`prim-${materia}`} value={materia}>
                {materia}
              </MenuItem>
            ))}

            <MenuItem disabled>──────────────────────────</MenuItem>

            <ListSubheader sx={{ fontWeight: "bold", bgcolor: "secondary.50", color: "secondary.main" }}>
              🎓 SECUNDARIA
            </ListSubheader>
            {materiasSecundaria.map((materia) => (
              <MenuItem key={`sec-${materia}`} value={materia}>
                {materia}
              </MenuItem>
            ))}

            <ListSubheader sx={{ mt: 1 }} />
            <MenuItem
              value="OTRO"
              sx={{
                bgcolor: "warning.lighter",
                "&:hover": { bgcolor: "warning.light" },
                borderRadius: 1,
                mx: 1,
              }}
            >
              <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <strong>+ Otro (escribir nombre personalizado)</strong>
            </MenuItem>
          </TextField>

          {/* Campo adicional solo cuando se elige "Otro" */}
          {selectedMateria === "OTRO" && (
            <TextField
              label="Nombre de la Materia Personalizada"
              placeholder="Ej: Robótica, Ajedrez, Danza, Religión..."
              value={nombrePersonalizado}
              onChange={(e) => {
                setNombrePersonalizado(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleSubmit();
              }}
              fullWidth
              autoFocus
              disabled={loading}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  borderColor: "warning.main",
                  "& fieldset": { borderWidth: 2 },
                },
              }}
              helperText="Este nombre se guardará tal como lo escribas"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading} size="large">
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !nombreFinal.trim()}
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Creando..." : "Crear Materia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}