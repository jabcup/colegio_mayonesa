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
  paralelo: { nombre: string };
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
  const [padreErrors, setPadreErrors] = useState<FormErrors>({});

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
    apellidoMat: "", // Opcional
    telefono: "",
    correo: "",
  });

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
  // === RESTRICCIONES PADRE (copiadas de FormPadre) ===
  const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,20}$/;

  const limpiarEspacios = (texto: string) => texto.replace(/\s+/g, " ").trim();

  const capitalizar = (texto: string) =>
    texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

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
  //   if (!value.trim()) return `${fieldName} es requerido`;
  //   return "";
  // };

  const validateRequired = (value: any, fieldName: string): string => {
    // Caso 1: valor nulo o indefinido
    if (value === null || value === undefined) {
      return `${fieldName} es requerido`;
    }

    // Caso 2: string vacío o solo espacios
    if (typeof value === "string") {
      if (!value.trim()) {
        return `${fieldName} es requerido`;
      }
      return "";
    }

    // Caso 3: número (0 es válido)
    if (typeof value === "number") {
      return "";
    }

    // Caso 4: boolean (siempre válido)
    if (typeof value === "boolean") {
      return "";
    }

    // Caso 5: array vacío
    if (Array.isArray(value) && value.length === 0) {
      return `${fieldName} es requerido`;
    }

    // Caso 6: objeto vacío
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return `${fieldName} es requerido`;
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

  const validateFechaNacimiento = (date: string): string => {
    if (!date) return "Fecha de nacimiento es requerida";

    const birthDate = new Date(date);
    const today = new Date();

    // No permitir fechas futuras
    if (birthDate > today) {
      return "La fecha de nacimiento no puede ser futura";
    }

    // Calcular edad exacta
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Ajustar si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Validar rango de edad
    if (age < 5) {
      return "El estudiante debe tener al menos 5 años";
    }
    if (age > 18) {
      return "El estudiante no puede tener más de 18 años";
    }

    return ""; // Todo bien
  };

  const soloLetrasYEspacios = (texto: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(texto);
  };

  const soloNumeros = (texto: string): boolean => {
    const regex = /^[0-9]*$/;
    return regex.test(texto);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Bloquear números y símbolos en nombres y apellidos
    if (name === "nombres" || name === "apellidoPat" || name === "apellidoMat") {
      if (!soloLetrasYEspacios(value)) {
        // Si el usuario intenta poner número o símbolo → NO actualizamos el campo
        return;
      }
    }

    // Bloquear letras y símbolos en CI y teléfono de referencia
    if (name === "identificacion" || name === "telefono_referencia") {
      if (!soloNumeros(value)) {
        return; // Solo permite números
      }
    }

    // Actualizar el formulario solo si pasa la validación
    setForm({ ...form, [name]: value });

    // Validación en tiempo real (tus validaciones existentes)
    let error = "";

    switch (name) {
      case "nombres":
        error = validateRequired(value, "Nombres");
        if (!error) error = validateLength(value, 2, 50, "Nombres");
        if (!error && !soloLetrasYEspacios(value)) {
          error = "Solo se permiten letras y espacios";
        }
        break;

      case "apellidoPat":
        error = validateRequired(value, "Apellido Paterno");
        if (!error) error = validateLength(value, 2, 50, "Apellido Paterno");
        if (!error && !soloLetrasYEspacios(value)) {
          error = "Solo se permiten letras y espacios";
        }
        break;

      case "apellidoMat":
        if (value && value.trim() !== "") {
          error = validateLength(value, 2, 50, "Apellido Materno");
          if (!error && !soloLetrasYEspacios(value)) {
            error = "Solo se permiten letras y espacios";
          }
        }
        break;

      // ... el resto de casos quedan IGUAL (identificacion, correo, etc.)
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

      case "direccion":
        error = validateRequired(value, "Dirección");
        if (!error) error = validateLength(value, 5, 200, "Dirección");
        break;

      case "telefono_referencia":
        if (value && !validatePhone(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        break;

      case "fecha_nacimiento":
        error = validateFechaNacimiento(value);
        break;

      case "sexo":
        error = validateRequired(value, "Sexo");
        break;

      case "nacionalidad":
        error = validateRequired(value, "Nacionalidad");
        break;

      case "relacion":
        error = validateRequired(value, "Relación");
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

    let nuevoValor = value;

    // Normalizar solo nombres y apellidos
    if (["nombres", "apellidoPat", "apellidoMat"].includes(name)) {
      nuevoValor = capitalizar(limpiarEspacios(value));
    }

    setNuevoPadre({ ...nuevoPadre, [name]: nuevoValor });

    let error = "";

    switch (name) {
      case "nombres":
        if (!nuevoValor) {
          error = "Nombres es requerido";
        } else if (!SOLO_LETRAS_REGEX.test(nuevoValor)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "apellidoPat":
        if (!nuevoValor) {
          error = "Apellido Paterno es requerido";
        } else if (!SOLO_LETRAS_REGEX.test(nuevoValor)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "apellidoMat":
        if (nuevoValor && !SOLO_LETRAS_REGEX.test(nuevoValor)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "telefono":
        if (!nuevoValor.trim()) {
          error = "Teléfono es requerido";
        } else if (!/^[0-9]{7,15}$/.test(nuevoValor)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        break;

      case "correo":
        if (nuevoValor && !validateEmail(nuevoValor)) {
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

    // Validar campos principales del estudiante
    newErrors.nombres = validateRequired(form.nombres, "Nombres");
    if (!newErrors.nombres) newErrors.nombres = validateLength(form.nombres, 2, 50, "Nombres");

    newErrors.apellidoPat = validateRequired(form.apellidoPat, "Apellido Paterno");
    if (!newErrors.apellidoPat) newErrors.apellidoPat = validateLength(form.apellidoPat, 2, 50, "Apellido Paterno");

    // Apellido materno es opcional, solo validar longitud si se ingresa
    if (form.apellidoMat && form.apellidoMat.trim() !== "") {
      newErrors.apellidoMat = validateLength(
        form.apellidoMat,
        2,
        50,
        "Apellido Materno"
      );
    }

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

    newErrors.fecha_nacimiento = validateFechaNacimiento(form.fecha_nacimiento);
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
      newPadreErrors.nombres = !nuevoPadre.nombres
        ? "Nombres es requerido"
        : !SOLO_LETRAS_REGEX.test(nuevoPadre.nombres)
        ? "Solo letras, sin números ni símbolos (máx. 20)"
        : "";

      newPadreErrors.apellidoPat = !nuevoPadre.apellidoPat
        ? "Apellido Paterno es requerido"
        : !SOLO_LETRAS_REGEX.test(nuevoPadre.apellidoPat)
        ? "Solo letras, sin números ni símbolos (máx. 20)"
        : "";

      if (
        nuevoPadre.apellidoMat &&
        !SOLO_LETRAS_REGEX.test(nuevoPadre.apellidoMat)
      ) {
        newPadreErrors.apellidoMat =
          "Solo letras, sin números ni símbolos (máx. 20)";
      }

      newPadreErrors.telefono = !nuevoPadre.telefono
        ? "Teléfono es requerido"
        : !/^[0-9]{7,15}$/.test(nuevoPadre.telefono)
        ? "Teléfono inválido (7-15 dígitos)"
        : "";

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

    // Remover apellidoMat si está vacío para enviarlo como undefined
    if (!payload.apellidoMat || payload.apellidoMat.trim() === "") {
      delete payload.apellidoMat;
    }

    // Remover idPadre temporalmente
    delete payload.idPadre;

    if (crearNuevoPadre) {
      payload.padreData = {
        ...nuevoPadre,
        correo: nuevoPadre.correo || undefined,
      };
      // También para el padre, apellidoMat es opcional
      if (
        !payload.padreData.apellidoMat ||
        payload.padreData.apellidoMat.trim() === ""
      ) {
        delete payload.padreData.apellidoMat;
      }
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
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
              margin="normal"
            />

            <TextField
              label="Primer Apellido *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Segundo Apellido"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat || "Opcional"}
              fullWidth
              margin="normal"
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
              margin="normal"
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
              margin="normal"
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
              margin="normal"
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
              margin="normal"
            />

            <TextField
              type="date"
              label="Fecha Nacimiento *"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento || "Edad permitida: 5 a 18 años"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
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
              margin="normal"
            >
              <MenuItem value="">Seleccione...</MenuItem>
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
            </TextField>

            <TextField
              label="Nacionalidad *"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              error={!!errors.nacionalidad}
              helperText={errors.nacionalidad}
              fullWidth
              margin="normal"
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
              margin="normal"
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
                margin="normal"
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
                  margin="normal"
                  inputProps={{ maxLength: 20 }}
                />
                <TextField
                  label="Primer Apellido *"
                  name="apellidoPat"
                  value={nuevoPadre.apellidoPat}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.apellidoPat}
                  helperText={padreErrors.apellidoPat}
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: 20 }}
                />
                <TextField
                  label="Segundo Apellido"
                  name="apellidoMat"
                  value={nuevoPadre.apellidoMat}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.apellidoMat}
                  helperText={padreErrors.apellidoMat || "Opcional"}
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: 20 }}
                />

                <TextField
                  label="Teléfono *"
                  name="telefono"
                  value={nuevoPadre.telefono}
                  onChange={handleNuevoPadreChange}
                  error={!!padreErrors.telefono}
                  helperText={padreErrors.telefono || "7-15 dígitos"}
                  inputProps={{ maxLength: 15, inputMode: "numeric" }}
                  fullWidth
                  margin="normal"
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
                  margin="normal"
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
              margin="normal"
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
