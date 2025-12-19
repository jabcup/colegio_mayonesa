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
  FormHelperText,
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
  paralelo: { nombre: string};
  gestion: number;
}

interface FormErrors {
  [key: string]: string;
}

export default function FormEstudiante({ open, onClose, onCreate }: Props) {
  const [loading, setLoading] = useState(false);
  const [padres, setPadres] = useState<Padre[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [crearNuevoPadre, setCrearNuevoPadre] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const [padreErrors, setPadreErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      cargarDatos();
      // Limpiar errores al abrir
      setErrors({});
      setPadreErrors({});
    }
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api.get("/padres/MostrarPadres"),
        api.get("/cursos/CursosActivos"),
      ]);
      setPadres(p.data || []);
      setCursos(c.data || []);
    } finally {
      setLoading(false);
    }
  };

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  const validateCI = (ci: string): boolean => {
    const ciRegex = /^[0-9]{5,15}$/;
    return ci === "" || ciRegex.test(ci);
  };

  // const validateRequired = (value: string, fieldName: string): string => {
  //   console.log(value);
  //   if (!value.trim()) return `${fieldName} es requerido`;
  //   return "";
  // };
  const validateRequired = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) {
      return `${fieldName} es requerido`;
    }

    // Si es string
    if (typeof value === "string") {
      if (!value.trim()) return `${fieldName} es requerido`;
    }
    // Si es number
    else if (typeof value === "number") {
      if (isNaN(value) || value <= 0) return `${fieldName} es requerido`;
    }
    // Otros tipos (select, etc.)
    else {
      if (!value) return `${fieldName} es requerido`;
    }

    return "";
  };

  const validateLength = (
    value: string,
    min: number,
    max: number,
    fieldName: string
  ): string => {
    if (value && (value.length < min || value.length > max)) {
      return `${fieldName} debe tener entre ${min} y ${max} caracteres`;
    }
    return "";
  };

  const validateDate = (date: string): string => {
    if (!date) return "Fecha de nacimiento es requerida";

    const selectedDate = new Date(date);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);

    if (selectedDate > today) return "La fecha no puede ser futura";
    if (selectedDate < minDate) return "Fecha no válida";

    return "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validación en tiempo real
    let error = "";

    switch (name) {
      case "nombres":
      case "apellidoPat":
      case "apellidoMat":
        error = validateRequired(
          value,
          name === "nombres"
            ? "Nombres"
            : name === "apellidoPat"
            ? "Apellido Paterno"
            : "Apellido Materno"
        );
        if (!error)
          error = validateLength(
            value,
            2,
            50,
            name === "nombres"
              ? "Nombres"
              : name === "apellidoPat"
              ? "Apellido Paterno"
              : "Apellido Materno"
          );
        break;

      case "identificacion":
        if (value && !validateCI(value)) {
          error = "La CI debe contener solo números (5-15 dígitos)";
        }
        if (!error) error = validateRequired(value, "CI");
        break;

      case "correo":
        if (value && !validateEmail(value)) {
          error = "Formato de correo inválido";
        }
        break;

      case "telefono_referencia":
        if (value && !validatePhone(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        if (!error && crearNuevoPadre) {
          error = validateRequired(value, "Teléfono de referencia");
        }
        break;

      case "direccion":
        error = validateLength(value, 5, 200, "Dirección");
        if (!error) error = validateRequired(value, "Dirección");
        break;

      case "fecha_nacimiento":
        error = validateDate(value);
        break;

      case "sexo":
      case "nacionalidad":
      case "relacion":
        error = validateRequired(
          value,
          name === "sexo"
            ? "Sexo"
            : name === "nacionalidad"
            ? "Nacionalidad"
            : "Relación"
        );
        break;

      case "idCurso":
        error = validateRequired(value, "Curso");
        break;

      case "idPadre":
        if (!crearNuevoPadre) {
          error = validateRequired(value, "Padre");
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleNuevoPadreChange = (e: any) => {
    const { name, value } = e.target;
    setNuevoPadre({ ...nuevoPadre, [name]: value });

    // Validación para nuevo padre
    let error = "";

    switch (name) {
      case "nombres":
      case "apellidoPat":
      case "apellidoMat":
        error = validateRequired(
          value,
          name === "nombres"
            ? "Nombre del padre"
            : name === "apellidoPat"
            ? "Apellido Paterno"
            : "Apellido Materno"
        );
        if (!error)
          error = validateLength(
            value,
            2,
            50,
            name === "nombres"
              ? "Nombre del padre"
              : name === "apellidoPat"
              ? "Apellido Paterno"
              : "Apellido Materno"
          );
        break;

      case "telefono":
        if (value && !validatePhone(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        error = validateRequired(value, "Teléfono");
        break;

      case "correo":
        if (value && !validateEmail(value)) {
          error = "Formato de correo inválido";
        }
        break;
    }

    setPadreErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const newPadreErrors: FormErrors = {};

    // Validar campos principales
    newErrors.nombres = validateRequired(form.nombres, "Nombres");
    if (!newErrors.nombres)
      newErrors.nombres = validateLength(form.nombres, 2, 50, "Nombres");

    newErrors.apellidoPat = validateRequired(
      form.apellidoPat,
      "Apellido Paterno"
    );
    if (!newErrors.apellidoPat)
      newErrors.apellidoPat = validateLength(
        form.apellidoPat,
        2,
        50,
        "Apellido Paterno"
      );

    newErrors.apellidoMat = validateRequired(
      form.apellidoMat,
      "Apellido Materno"
    );
    if (!newErrors.apellidoMat)
      newErrors.apellidoMat = validateLength(
        form.apellidoMat,
        2,
        50,
        "Apellido Materno"
      );

    newErrors.identificacion = validateRequired(form.identificacion, "CI");
    if (!newErrors.identificacion && !validateCI(form.identificacion)) {
      newErrors.identificacion =
        "La CI debe contener solo números (5-15 dígitos)";
    }

    if (form.correo && !validateEmail(form.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    newErrors.direccion = validateRequired(form.direccion, "Dirección");
    if (!newErrors.direccion)
      newErrors.direccion = validateLength(form.direccion, 5, 200, "Dirección");

    if (form.telefono_referencia && !validatePhone(form.telefono_referencia)) {
      newErrors.telefono_referencia = "Teléfono inválido (7-15 dígitos)";
    }

    newErrors.fecha_nacimiento = validateDate(form.fecha_nacimiento);
    newErrors.sexo = validateRequired(form.sexo, "Sexo");
    newErrors.nacionalidad = validateRequired(
      form.nacionalidad,
      "Nacionalidad"
    );
    newErrors.relacion = validateRequired(form.relacion, "Relación");
    newErrors.idCurso = validateRequired(form.idCurso, "Curso");

    if (!crearNuevoPadre) {
      newErrors.idPadre = validateRequired(form.idPadre, "Padre");
    }

    // Validar nuevo padre si es necesario
    if (crearNuevoPadre) {
      newPadreErrors.nombres = validateRequired(
        nuevoPadre.nombres,
        "Nombre del padre"
      );
      if (!newPadreErrors.nombres)
        newPadreErrors.nombres = validateLength(
          nuevoPadre.nombres,
          2,
          50,
          "Nombre del padre"
        );

      newPadreErrors.apellidoPat = validateRequired(
        nuevoPadre.apellidoPat,
        "Apellido Paterno"
      );
      if (!newPadreErrors.apellidoPat)
        newPadreErrors.apellidoPat = validateLength(
          nuevoPadre.apellidoPat,
          2,
          50,
          "Apellido Paterno"
        );

      newPadreErrors.apellidoMat = validateRequired(
        nuevoPadre.apellidoMat,
        "Apellido Materno"
      );
      if (!newPadreErrors.apellidoMat)
        newPadreErrors.apellidoMat = validateLength(
          nuevoPadre.apellidoMat,
          2,
          50,
          "Apellido Materno"
        );

      newPadreErrors.telefono = validateRequired(
        nuevoPadre.telefono,
        "Teléfono"
      );
      if (!newPadreErrors.telefono && !validatePhone(nuevoPadre.telefono)) {
        newPadreErrors.telefono = "Teléfono inválido (7-15 dígitos)";
      }

      if (nuevoPadre.correo && !validateEmail(nuevoPadre.correo)) {
        newPadreErrors.correo = "Formato de correo inválido";
      }
    }

    setErrors(newErrors);
    setPadreErrors(newPadreErrors);

    // Verificar si hay errores
    const hasErrors =
      Object.values(newErrors).some((error) => error !== "") ||
      Object.values(newPadreErrors).some((error) => error !== "");

    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Por favor, complete todos los campos requeridos correctamente.");
      return;
    }

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
            <TextField
              label="Nombres *"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              error={!!errors.nombres}
              helperText={errors.nombres}
              fullWidth
            />

            <TextField
              label="Apellido Paterno *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat}
              fullWidth
            />

            <TextField
              label="Apellido Materno *"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat}
              fullWidth
            />

            <TextField
              label="CI *"
              name="identificacion"
              value={form.identificacion}
              onChange={handleChange}
              error={!!errors.identificacion}
              helperText={errors.identificacion || "Solo números, 5-15 dígitos"}
              inputProps={{ maxLength: 15 }}
              fullWidth
            />

            <TextField
              label="Correo"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              error={!!errors.correo}
              helperText={errors.correo}
              fullWidth
            />

            <TextField
              label="Dirección *"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              error={!!errors.direccion}
              helperText={errors.direccion}
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Teléfono de referencia"
              name="telefono_referencia"
              value={form.telefono_referencia}
              onChange={handleChange}
              error={!!errors.telefono_referencia}
              helperText={errors.telefono_referencia || "7-15 dígitos"}
              inputProps={{ maxLength: 15 }}
              fullWidth
            />

            <TextField
              type="date"
              label="Fecha Nacimiento *"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              label="Sexo *"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              error={!!errors.sexo}
              helperText={errors.sexo}
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </TextField>

            <TextField
              label="Nacionalidad *"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              error={!!errors.nacionalidad}
              helperText={errors.nacionalidad}
              fullWidth
            />

            <TextField
              select
              label="Relación *"
              name="relacion"
              value={form.relacion}
              onChange={handleChange}
              error={!!errors.relacion}
              helperText={errors.relacion}
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              <MenuItem value="Padre">Padre</MenuItem>
              <MenuItem value="Madre">Madre</MenuItem>
              <MenuItem value="Hermano">Hermano</MenuItem>
              <MenuItem value="Hermana">Hermana</MenuItem>
              <MenuItem value="Tutor">Tutor</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={crearNuevoPadre}
                  onChange={(e) => setCrearNuevoPadre(e.target.checked)}
                />
              }
              label="Registrar nuevo padre"
            />

            {!crearNuevoPadre && (
              <TextField
                select
                label="Padre *"
                name="idPadre"
                value={form.idPadre}
                onChange={handleChange}
                error={!!errors.idPadre}
                helperText={errors.idPadre}
                fullWidth
              >
                <MenuItem value="">Seleccione un padre...</MenuItem>
                {padres.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombres} {p.apellidoPat} {p.apellidoMat}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {crearNuevoPadre && (
              <>
                <TextField
                  label="Nombre Padre *"
                  name="nombres"
                  value={nuevoPadre.nombres}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.nombres}
                  helperText={padreErrors.nombres}
                  fullWidth
                />
                <TextField
                  label="Apellido Paterno *"
                  name="apellidoPat"
                  value={nuevoPadre.apellidoPat}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.apellidoPat}
                  helperText={padreErrors.apellidoPat}
                  fullWidth
                />
                <TextField
                  label="Apellido Materno *"
                  name="apellidoMat"
                  value={nuevoPadre.apellidoMat}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.apellidoMat}
                  helperText={padreErrors.apellidoMat}
                  fullWidth
                />
                <TextField
                  label="Teléfono *"
                  name="telefono"
                  value={nuevoPadre.telefono}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.telefono}
                  helperText={padreErrors.telefono || "7-15 dígitos"}
                  inputProps={{ maxLength: 15 }}
                  fullWidth
                />
                <TextField
                  label="Correo"
                  name="correo"
                  type="email"
                  value={nuevoPadre.correo}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.correo}
                  helperText={padreErrors.correo}
                  fullWidth
                />
              </>
            )}

            <TextField
              select
              label="Curso *"
              name="idCurso"
              value={form.idCurso}
              onChange={handleChange}
              error={!!errors.idCurso}
              helperText={errors.idCurso}
              fullWidth
            >
              <MenuItem value="">Seleccione un curso...</MenuItem>
              {cursos.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre} - {c.paralelo.nombre} ({c.gestion})
                </MenuItem>
              ))}
            </TextField>

            <FormHelperText sx={{ mt: 1, color: "text.secondary" }}>
              * Campos obligatorios
            </FormHelperText>
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
