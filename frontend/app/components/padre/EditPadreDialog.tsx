"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  padre: any;
  onUpdated: () => void;
}

interface FormErrors {
  [key: string]: string;
}

// 🔒 MISMAS REGLAS QUE FormPadre
const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,20}$/;

const limpiarEspacios = (texto: string) => texto.replace(/\s+/g, " ").trim();

const capitalizar = (texto: string) =>
  texto
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

export default function EditPadreDialog({
  open,
  onClose,
  padre,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (padre) {
      setForm({
        nombres: padre.nombres || "",
        apellidoPat: padre.apellidoPat || "",
        apellidoMat: padre.apellidoMat || "",
        telefono: padre.telefono || "",
      });
      setErrors({});
    }
  }, [padre]);

  /* ================= CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (["nombres", "apellidoPat", "apellidoMat"].includes(name)) {
      nuevoValor = capitalizar(limpiarEspacios(value));
    }

    setForm({ ...form, [name]: nuevoValor });
    validateField(name, nuevoValor);
  };

  /* ================= VALIDAR CAMPO ================= */

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
        if (!value) {
          error = "Teléfono es requerido";
        } else if (!/^[0-9]{7,15}$/.test(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /* ================= VALIDAR FORM ================= */

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

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await api.put(`/padres/editar/${padre.id}`, {
        nombres: form.nombres,
        apellidoPat: form.apellidoPat,
        apellidoMat: form.apellidoMat || undefined,
        telefono: form.telefono,
      });

      alert("Padre actualizado");
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al actualizar");
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Padre</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nombres *"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
          error={!!errors.nombres}
          helperText={errors.nombres}
        />

        <TextField
          label="Apellido Paterno *"
          name="apellidoPat"
          value={form.apellidoPat}
          onChange={handleChange}
          error={!!errors.apellidoPat}
          helperText={errors.apellidoPat}
        />

        <TextField
          label="Apellido Materno"
          name="apellidoMat"
          value={form.apellidoMat}
          onChange={handleChange}
          error={!!errors.apellidoMat}
          helperText={errors.apellidoMat || "Opcional"}
        />

        <TextField
          label="Teléfono *"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          error={!!errors.telefono}
          helperText={errors.telefono || "7-15 dígitos"}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
