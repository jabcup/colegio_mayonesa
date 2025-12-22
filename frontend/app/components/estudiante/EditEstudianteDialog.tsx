"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { api } from "@/app/lib/api";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion: string;
  correo: string;
  correo_institucional: string;
  rude: string;
  direccion: string;
  telefono_referencia: string;
  fecha_nacimiento: string;
  sexo: string;
  nacionalidad: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  open: boolean;
  estudiante: Estudiante | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditEstudianteDialog({
  open,
  estudiante,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);

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
  });

  const [errors, setErrors] = useState<{
    nombres?: string;
    apellidoPat?: string;
    apellidoMat?: string;
    identificacion?: string;
    correo?: string;
    telefono_referencia?: string;
    fecha_nacimiento?: string;
  }>({});

  // Cambia este dominio por el de tu institución
  const DOMINIO_INSTITUCIONAL = "colegio.edu.bo";

  useEffect(() => {
    if (estudiante) {
      setForm({
        nombres: estudiante.nombres || "",
        apellidoPat: estudiante.apellidoPat || "",
        apellidoMat: estudiante.apellidoMat || "",
        identificacion: estudiante.identificacion || "",
        correo: estudiante.correo || "",
        direccion: estudiante.direccion || "",
        telefono_referencia: estudiante.telefono_referencia || "",
        fecha_nacimiento: estudiante.fecha_nacimiento || "",
        sexo: estudiante.sexo || "",
        nacionalidad: estudiante.nacionalidad || "",
      });
      setErrors({});
    }
  }, [estudiante]);

  // Validaciones
  const soloLetrasYEspacios = (texto: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(texto);
  };

  const soloNumeros = (texto: string): boolean => {
    const regex = /^[0-9]*$/;
    return regex.test(texto);
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Formato de correo inválido";
  };

  const validateCI = (ci: string): string => {
    if (!ci.trim()) return "CI es requerido";
    if (!soloNumeros(ci)) return "La CI solo puede contener números";
    if (ci.length < 5 || ci.length > 15) return "CI debe tener entre 5 y 15 dígitos";
    return "";
  };

  const validateTelefono = (tel: string): string => {
    if (!tel.trim()) return ""; // Opcional
    if (!soloNumeros(tel)) return "El teléfono solo puede contener números";
    if (tel.length < 7 || tel.length > 15) return "Teléfono debe tener entre 7 y 15 dígitos";
    return "";
  };

  const validateFechaNacimiento = (date: string): string => {
    if (!date) return "Fecha de nacimiento es requerida";

    const birthDate = new Date(date);
    const today = new Date();

    if (birthDate > today) {
      return "La fecha no puede ser futura";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 5) return "El estudiante debe tener al menos 5 años";
    if (age > 18) return "El estudiante no puede tener más de 18 años";

    return "";
  };

  const generarCorreoInstitucional = (): string => {
    if (!form.nombres || !form.identificacion) {
      return "No disponible hasta completar nombre y CI";
    }
    const primerNombre = form.nombres.trim().split(" ")[0].toLowerCase();
    const ci = form.identificacion.trim();
    return `${primerNombre}.${ci}@${DOMINIO_INSTITUCIONAL}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Bloquear caracteres no permitidos según el campo
    if (name === "nombres" || name === "apellidoPat" || name === "apellidoMat") {
      if (!soloLetrasYEspacios(value)) {
        return; // No permite números ni símbolos
      }
    }

    if (name === "identificacion" || name === "telefono_referencia") {
      if (!soloNumeros(value)) {
        return; // Solo permite números
      }
    }

    setForm({ ...form, [name]: finalValue });

    // Validación en tiempo real
    let error = "";
    switch (name) {
      case "nombres":
      case "apellidoPat":
        error = value.trim() ? "" : "Campo requerido";
        if (value && !soloLetrasYEspacios(value)) error = "Solo letras y espacios";
        break;
      case "apellidoMat":
        if (value.trim() && !soloLetrasYEspacios(value)) {
          error = "Solo letras y espacios";
        }
        break;
      case "identificacion":
        error = validateCI(value);
        break;
      case "telefono_referencia":
        error = validateTelefono(value);
        break;
      case "correo":
        error = validateEmail(value);
        break;
      case "fecha_nacimiento":
        error = validateFechaNacimiento(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    if (!estudiante) return;

    // Validación completa
    const newErrors: any = {};

    if (!form.nombres.trim()) newErrors.nombres = "Requerido";
    else if (!soloLetrasYEspacios(form.nombres)) newErrors.nombres = "Solo letras";

    if (!form.apellidoPat.trim()) newErrors.apellidoPat = "Requerido";
    else if (!soloLetrasYEspacios(form.apellidoPat)) newErrors.apellidoPat = "Solo letras";

    if (form.apellidoMat.trim() && !soloLetrasYEspacios(form.apellidoMat)) {
      newErrors.apellidoMat = "Solo letras";
    }

    newErrors.identificacion = validateCI(form.identificacion);
    newErrors.telefono_referencia = validateTelefono(form.telefono_referencia);
    newErrors.correo = validateEmail(form.correo);
    newErrors.fecha_nacimiento = validateFechaNacimiento(form.fecha_nacimiento);

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "")) {
      alert("Por favor, corrige los errores en el formulario");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/estudiante/editar/${estudiante.id}`, form);
      alert("Estudiante actualizado exitosamente");
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Estudiante</DialogTitle>

      <DialogContent>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <TextField
              label="Nombres *"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.nombres}
              helperText={errors.nombres || "Solo letras y espacios"}
            />

            <TextField
              label="Apellido Paterno *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat || "Solo letras y espacios"}
            />

            <TextField
              label="Apellido Materno"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat || "Opcional, solo letras"}
            />

            <TextField
              label="CI *"
              name="identificacion"
              value={form.identificacion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.identificacion}
              helperText={errors.identificacion || "Solo números (5-15 dígitos)"}
              inputProps={{ maxLength: 15 }}
            />

            <TextField
              label="Correo Institucional (generado)"
              value={generarCorreoInstitucional()}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              helperText="primerNombre.ci@colegio.edu.bo"
            />

            <TextField
              label="Correo Personal"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.correo}
              helperText={errors.correo || "Opcional"}
            />

            <TextField
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              label="Teléfono de Referencia"
              name="telefono_referencia"
              value={form.telefono_referencia}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.telefono_referencia}
              helperText={errors.telefono_referencia || "Solo números (7-15 dígitos)"}
              inputProps={{ maxLength: 15 }}
            />

            <TextField
              type="date"
              label="Fecha de Nacimiento *"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento || "Edad permitida: 5 a 18 años"}
            />

            <TextField
              select
              label="Sexo *"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
            </TextField>

            <TextField
              label="Nacionalidad"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}