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
  Checkbox
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
  telefono: string;
}

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
}

export default function FormEstudiante({ open, onClose, onCreate }: Props) {
  const [padres, setPadres] = useState<Padres[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);

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
    idCurso: ""
  });

  const [nuevoPadre, setNuevoPadre] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    identificacion: "",
    correo: "",
    telefono: "",
    direccion: ""
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
      alert("Error al cargar los datos");
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
    const payload = {
      ...form,
      idPadre: crearNuevoPadre ? null : Number(form.idPadre),
      idCurso: Number(form.idCurso),
      nuevoPadre: crearNuevoPadre ? nuevoPadre : null,
    };

    console.log("Payload enviado:", payload);
    onCreate(payload);

    // Reset
    setForm({
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
      idCurso: ""
    });

    setNuevoPadre({
      nombres: "",
      apellidoPat: "",
      apellidoMat: "",
      identificacion: "",
      correo: "",
      telefono: "",
      direccion: ""
    });

    setCrearNuevoPadre(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Registrar Estudiante</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Campos del Estudiante */}
            <TextField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} fullWidth required />
            <TextField label="Apellido Paterno" name="apellidoPat" value={form.apellidoPat} onChange={handleChange} fullWidth required />
            <TextField label="Apellido Materno" name="apellidoMat" value={form.apellidoMat} onChange={handleChange} fullWidth required />
            <TextField label="Identificación" name="identificacion" value={form.identificacion} onChange={handleChange} fullWidth />
            <TextField label="Correo" name="correo" value={form.correo} onChange={handleChange} fullWidth />
            <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} fullWidth />
            <TextField label="Teléfono de Referencia" name="telefono_referencia" value={form.telefono_referencia} onChange={handleChange} fullWidth />

            <TextField
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField label="Sexo" name="sexo" value={form.sexo} onChange={handleChange} fullWidth />
            <TextField label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} fullWidth />
            <TextField label="Relación con el Padre" name="relacion" value={form.relacion} onChange={handleChange} fullWidth />

            {/* Switch para crear nuevo padre */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={crearNuevoPadre}
                  onChange={(e) => setCrearNuevoPadre(e.target.checked)}
                />
              }
              label="Registrar nuevo padre"
            />

            {/* Selección de padres existentes */}
            {!crearNuevoPadre && (
              <TextField
                select
                label="Padre / Tutor"
                name="idPadre"
                value={form.idPadre}
                onChange={handleChange}
                fullWidth
                required
              >
                {padres.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombres} {p.apellidoPat} {p.apellidoMat}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Formulario de nuevo padre */}
            {crearNuevoPadre && (
              <>
                <TextField label="Nombre del Padre" name="nombres" value={nuevoPadre.nombres} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Apellido Paterno" name="apellidoPat" value={nuevoPadre.apellidoPat} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Apellido Materno" name="apellidoMat" value={nuevoPadre.apellidoMat} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Identificación" name="identificacion" value={nuevoPadre.identificacion} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Correo" name="correo" value={nuevoPadre.correo} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Teléfono" name="telefono" value={nuevoPadre.telefono} onChange={handleNuevoPadreChange} fullWidth />
                <TextField label="Dirección" name="direccion" value={nuevoPadre.direccion} onChange={handleNuevoPadreChange} fullWidth />
              </>
            )}

            {/* Cursos */}
            <TextField
              select
              label="Curso"
              name="idCurso"
              value={form.idCurso}
              onChange={handleChange}
              fullWidth
              required
            >
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
        <Button
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          variant="contained"
        >
          Registrar Estudiante
        </Button>
      </DialogActions>
    </Dialog>
  );
}
