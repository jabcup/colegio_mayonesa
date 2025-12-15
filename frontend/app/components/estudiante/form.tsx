"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

interface Padre {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
}

export default function FormEstudiante({ open, onClose, onCreate }: Props) {
  const [loading, setLoading] = useState(false);
  const [padres, setPadres] = useState<Padre[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [crearNuevoPadre, setCrearNuevoPadre] = useState(false);

  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    identificacion: "",
    correo: "",
    direccion: "",
    telefono_referencia: "",
    fecha_nacimiento: "",
    sexo: "",
    nacionalidad: "",
    relacion: "",
    idPadre: "",
    idCurso: "",
  });

  const [nuevoPadre, setNuevoPadre] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api.get("/padres/MostrarPadres"),
        api.get("/cursos/MostrarCursos"),
      ]);
      setPadres(p.data || []);
      setCursos(c.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNuevoPadreChange = (e: any) =>
    setNuevoPadre({ ...nuevoPadre, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const payload: any = {
      ...form,
      idCurso: Number(form.idCurso),
    };

    delete payload.idPadre;

    if (crearNuevoPadre) {
      payload.padreData = {
        ...nuevoPadre,
        correo: nuevoPadre.correo || undefined,
      };
    } else {
      if (!form.idPadre) {
        alert("Debe seleccionar un padre");
        return;
      }
      payload.idPadre = Number(form.idPadre);
    }

    onCreate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Registrar Estudiante</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField label="Nombres" name="nombres" onChange={handleChange} />
            <TextField label="Apellido Paterno" name="apellidoPat" onChange={handleChange} />
            <TextField label="Apellido Materno" name="apellidoMat" onChange={handleChange} />
            <TextField label="CI" name="identificacion" onChange={handleChange} />
            <TextField label="Correo" name="correo" onChange={handleChange} />
            <TextField label="Dirección" name="direccion" onChange={handleChange} />
            <TextField label="Teléfono" name="telefono_referencia" onChange={handleChange} />
            <TextField type="date" label="Fecha Nacimiento" name="fecha_nacimiento" onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Sexo" name="sexo" onChange={handleChange} />
            <TextField label="Nacionalidad" name="nacionalidad" onChange={handleChange} />
            <TextField label="Relación" name="relacion" onChange={handleChange} />

            <FormControlLabel
              control={<Checkbox checked={crearNuevoPadre} onChange={(e) => setCrearNuevoPadre(e.target.checked)} />}
              label="Registrar nuevo padre"
            />

            {!crearNuevoPadre && (
              <TextField select label="Padre" name="idPadre" onChange={handleChange}>
                {padres.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombres} {p.apellidoPat} {p.apellidoMat}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {crearNuevoPadre && (
              <>
                <TextField label="Nombre Padre" name="nombres" onChange={handleNuevoPadreChange} />
                <TextField label="Apellido Paterno" name="apellidoPat" onChange={handleNuevoPadreChange} />
                <TextField label="Apellido Materno" name="apellidoMat" onChange={handleNuevoPadreChange} />
                <TextField label="Teléfono" name="telefono" onChange={handleNuevoPadreChange} />
                <TextField label="Correo" name="correo" onChange={handleNuevoPadreChange} />
              </>
            )}

            <TextField select label="Curso" name="idCurso" onChange={handleChange}>
              {cursos.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre} - {c.paralelo} ({c.gestion})
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
