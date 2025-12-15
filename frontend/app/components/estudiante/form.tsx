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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
}

interface Padres {
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
  const [padres, setPadres] = useState<Padres[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [crearNuevoPadre, setCrearNuevoPadre] = useState(false);

  // ---------------- ESTUDIANTE ----------------
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

  // ---------------- PADRE NUEVO ----------------
  const [nuevoPadre, setNuevoPadre] = useState({
    nombresPadre: "",
    apellidoPatPadre: "",
    apellidoMatPadre: "",
    identificacionPadre: "",
    correoPadre: "",
    telefonoPadre: "",
    direccionPadre: "",
  });

  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [padresRes, cursosRes] = await Promise.all([
        api.get("/padres/MostrarPadres"),
        api.get("/cursos/MostrarCursos"),
      ]);

      setPadres(padresRes.data || []);
      setCursos(cursosRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNuevoPadreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoPadre({ ...nuevoPadre, [e.target.name]: e.target.value });
  };

const handleSubmit = () => {
  const payload: any = {
    nombres: form.nombres,
    apellidoPat: form.apellidoPat,
    apellidoMat: form.apellidoMat,
    identificacion: form.identificacion,
    correo: form.correo,
    direccion: form.direccion,
    telefono_referencia: form.telefono_referencia,
    fecha_nacimiento: new Date(form.fecha_nacimiento),
    sexo: form.sexo,
    nacionalidad: form.nacionalidad,
    relacion: form.relacion,
    idCurso: Number(form.idCurso),
  };

  if (crearNuevoPadre) {
    payload.padreData = {
      nombres: nuevoPadre.nombresPadre,
      apellidoPat: nuevoPadre.apellidoPatPadre,
      apellidoMat: nuevoPadre.apellidoMatPadre,
      identificacion: nuevoPadre.identificacionPadre,
      correo: nuevoPadre.correoPadre,
      telefono: nuevoPadre.telefonoPadre,
      direccion: nuevoPadre.direccionPadre,
    };
  } else {
    payload.idPadre = Number(form.idPadre);
  }

  console.log("Payload FINAL limpio:", payload);
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
            {/* -------- ESTUDIANTE -------- */}
            <TextField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} required />
            <TextField label="Apellido Paterno" name="apellidoPat" value={form.apellidoPat} onChange={handleChange} required />
            <TextField label="Apellido Materno" name="apellidoMat" value={form.apellidoMat} onChange={handleChange} required />
            <TextField label="CI" name="identificacion" value={form.identificacion} onChange={handleChange} />
            <TextField label="Correo" name="correo" value={form.correo} onChange={handleChange} />
            <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
            <TextField label="Teléfono" name="telefono_referencia" value={form.telefono_referencia} onChange={handleChange} />

            <TextField
              type="date"
              label="Fecha de nacimiento"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField label="Sexo" name="sexo" value={form.sexo} onChange={handleChange} />
            <TextField label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
            <TextField label="Relación" name="relacion" value={form.relacion} onChange={handleChange} />

            {/* -------- PADRE -------- */}
            <FormControlLabel
              control={<Checkbox checked={crearNuevoPadre} onChange={(e) => setCrearNuevoPadre(e.target.checked)} />}
              label="Registrar nuevo padre"
            />

            {!crearNuevoPadre && (
              <TextField select label="Padre" name="idPadre" value={form.idPadre} onChange={handleChange} required>
                {padres.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombres} {p.apellidoPat} {p.apellidoMat}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {crearNuevoPadre && (
              <>
                <TextField label="Nombre Padre" name="nombresPadre" value={nuevoPadre.nombresPadre} onChange={handleNuevoPadreChange} />
                <TextField label="Apellido Paterno" name="apellidoPatPadre" value={nuevoPadre.apellidoPatPadre} onChange={handleNuevoPadreChange} />
                <TextField label="Apellido Materno" name="apellidoMatPadre" value={nuevoPadre.apellidoMatPadre} onChange={handleNuevoPadreChange} />
                <TextField label="CI Padre" name="identificacionPadre" value={nuevoPadre.identificacionPadre} onChange={handleNuevoPadreChange} />
                <TextField label="Correo Padre" name="correoPadre" value={nuevoPadre.correoPadre} onChange={handleNuevoPadreChange} />
                <TextField label="Teléfono Padre" name="telefonoPadre" value={nuevoPadre.telefonoPadre} onChange={handleNuevoPadreChange} />
                <TextField label="Dirección Padre" name="direccionPadre" value={nuevoPadre.direccionPadre} onChange={handleNuevoPadreChange} />
              </>
            )}

            {/* -------- CURSO -------- */}
            <TextField select label="Curso" name="idCurso" value={form.idCurso} onChange={handleChange} required>
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
