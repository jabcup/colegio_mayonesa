"use client";

import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FormFiltrosReporte({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState<string[]>([]);
  const [paralelos, setParalelos] = useState<string[]>([]);
  const [gestion, setGestion] = useState<number>(2025);

  const [form, setForm] = useState({
    curso: "",
    paralelo: "",
    gestion: gestion,
  });

  useEffect(() => {
    if (open) {
      // Aquí puedes cargar cursos y paralelos dinámicamente si quieres
      setCursos(['1ro', '2do', '3ro']); 
      setParalelos(['A', 'B', 'C']);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generarReporte = async () => {
    if (!form.curso || !form.paralelo)
      return alert("Seleccione curso y paralelo");

    setLoading(true);
    try {
      // Petición para descargar PDF
      const res = await fetch(
        `${api.defaults.baseURL}/reportes/CalificacionesPorCurso/pdf?curso=${form.curso}&paralelo=${form.paralelo}&gestion=${form.gestion}`,
        { method: "GET" }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_calificaciones_${form.curso}_${form.paralelo}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al generar reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Filtros para Reporte</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <TextField
                select
                label="Curso"
                name="curso"
                value={form.curso}
                onChange={handleChange}
              >
                {cursos.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Paralelo"
                name="paralelo"
                value={form.paralelo}
                onChange={handleChange}
              >
                {paralelos.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Gestión"
                type="number"
                name="gestion"
                value={form.gestion}
                onChange={handleChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={generarReporte} variant="contained">
            Generar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
