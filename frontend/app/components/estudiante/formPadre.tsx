"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  loading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// ✅ Regex: solo letras + espacios (2 a 20)
const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,20}$/;

// ✅ Limpia espacios dobles y trim
const limpiarEspacios = (texto: string) => texto.replace(/\s+/g, " ").trim();

// ✅ Capital Case
const capitalizar = (texto: string) =>
  texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

export default function FormPadre({
  open,
  onClose,
  onCreate,
  loading = false,
}: Props) {
  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    // 👉 Normalizar solo para nombres/apellidos
    if (["nombres", "apellidoPat", "apellidoMat"].includes(name)) {
      nuevoValor = capitalizar(limpiarEspacios(value));
    }

    setForm({ ...form, [name]: nuevoValor });
    validateField(name, nuevoValor);
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "nombres":
        if (!value) {
          error = "Nombres es requerido";
        } else if (!SOLO_LETRAS_REGEX.test(value)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "apellidoPat":
        if (!value) {
          error = "Apellido Paterno es requerido";
        } else if (!SOLO_LETRAS_REGEX.test(value)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "apellidoMat":
        if (value && !SOLO_LETRAS_REGEX.test(value)) {
          error = "Solo letras, sin números ni símbolos (máx. 20)";
        }
        break;

      case "telefono":
        if (!value.trim()) {
          error = "Teléfono es requerido";
        } else if (!/^[0-9]{7,15}$/.test(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nombres) {
      newErrors.nombres = "Nombres es requerido";
    } else if (!SOLO_LETRAS_REGEX.test(form.nombres)) {
      newErrors.nombres = "Solo letras, sin números ni símbolos (máx. 20)";
    }

    if (!form.apellidoPat) {
      newErrors.apellidoPat = "Apellido Paterno es requerido";
    } else if (!SOLO_LETRAS_REGEX.test(form.apellidoPat)) {
      newErrors.apellidoPat = "Solo letras, sin números ni símbolos (máx. 20)";
    }

    if (form.apellidoMat && !SOLO_LETRAS_REGEX.test(form.apellidoMat)) {
      newErrors.apellidoMat = "Solo letras, sin números ni símbolos (máx. 20)";
    }

    if (!form.telefono) {
      newErrors.telefono = "Teléfono es requerido";
    } else if (!/^[0-9]{7,15}$/.test(form.telefono)) {
      newErrors.telefono = "Teléfono inválido (7-15 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      nombres: form.nombres,
      apellidoPat: form.apellidoPat,
      telefono: form.telefono,
      ...(form.apellidoMat && { apellidoMat: form.apellidoMat }),
    };

    onCreate(payload);
  };

  const handleClose = () => {
    setForm({
      nombres: "",
      apellidoPat: "",
      apellidoMat: "",
      telefono: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Padre</DialogTitle>

      <DialogContent>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 40 }}
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
              label="Apellido Paterno *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Apellido Materno"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat || "Opcional"}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Teléfono *"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono || "7-15 dígitos"}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 15, inputMode: "numeric" }}
            />

            <FormHelperText sx={{ mt: 2 }}>
              * Campos obligatorios
            </FormHelperText>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
