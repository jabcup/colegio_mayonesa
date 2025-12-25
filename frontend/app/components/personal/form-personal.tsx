"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { api } from "@/app/lib/api";

interface Rol {
  id: number;
  nombre: string;
}

interface Personal {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat?: string;
  telefono?: string;
  identificacion: string;
  direccion?: string;
  correo: string;
  fecha_nacimiento?: string;
  idRol: number;
}

const defaultValues: Personal = {
  id: 0,
  nombres: "",
  apellidoPat: "",
  apellidoMat: "",
  telefono: "",
  identificacion: "",
  direccion: "",
  correo: "",
  fecha_nacimiento: "",
  idRol: 1,
};

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const validarSoloLetras = (texto: string): boolean => {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());
};

export default function PersonalForm({
  personalToEdit,
  onClose,
}: {
  personalToEdit?: Personal;
  onClose?: () => void;
}) {
  const router = useRouter();
  const isEdit = !!personalToEdit;
  const [form, setForm] = useState<Personal>(defaultValues);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get("/roles/RolesActivos")
      .then((r) => setRoles(r.data))
      .catch(() => alert("Error al cargar roles"));
  }, []);

  useEffect(() => {
    setForm(
      personalToEdit
        ? { ...defaultValues, ...personalToEdit }
        : defaultValues
    );
  }, [personalToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "nombres" || name === "apellidoPat" || name === "apellidoMat") {
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (!soloLetras.test(value)) {
        return;
      }
    }
    
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.nombres.trim()) {
      newErrors.nombres = "Nombres es requerido";
    } else if (!validarSoloLetras(form.nombres)) {
      newErrors.nombres = "Los nombres solo deben contener letras y espacios";
    }

    if (!form.apellidoPat.trim()) {
      newErrors.apellidoPat = "Apellido paterno es requerido";
    } else if (!validarSoloLetras(form.apellidoPat)) {
      newErrors.apellidoPat = "El apellido paterno solo debe contener letras y espacios";
    }

    if (form.apellidoMat && form.apellidoMat.trim() !== "" && !validarSoloLetras(form.apellidoMat)) {
      newErrors.apellidoMat = "El apellido materno solo debe contener letras y espacios";
    }

    if (!form.identificacion.trim()) {
      newErrors.identificacion = "Identificación es requerida";
    } else if (!/^\d+$/.test(form.identificacion)) {
      newErrors.identificacion = "La identificación debe contener solo números";
    }

    if (!form.correo.trim()) {
      newErrors.correo = "Correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }

    if (form.telefono && form.telefono.trim() !== "") {
      if (!/^\d+$/.test(form.telefono)) {
        newErrors.telefono = "El teléfono debe contener solo números";
      } else if (form.telefono.length !== 8) {
        newErrors.telefono = "El teléfono debe tener 8 dígitos";
      }
    }

    if (form.fecha_nacimiento) {
      const edad = calcularEdad(form.fecha_nacimiento);
      if (edad < 18) {
        newErrors.fecha_nacimiento = "El personal debe tener al menos 18 años";
      }
    } else {
      newErrors.fecha_nacimiento = "Fecha de nacimiento es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { id, ...rest } = form;

      const payload: any = {
        nombres: rest.nombres.trim(),
        apellidoPat: rest.apellidoPat.trim(),
        identificacion: rest.identificacion.trim(),
        correo: rest.correo.trim(),
        idRol: rest.idRol,
      };

      if (rest.apellidoMat?.trim()) payload.apellidoMat = rest.apellidoMat.trim();
      if (rest.telefono?.trim()) payload.telefono = rest.telefono.trim();
      if (rest.direccion?.trim()) payload.direccion = rest.direccion.trim();
      if (rest.fecha_nacimiento?.trim()) payload.fecha_nacimiento = rest.fecha_nacimiento.trim();

      isEdit
        ? await api.put(`/personal/EditarPersonal/${form.id}`, payload)
        : await api.post('/personal/CrearPersonalCompleto', payload);
      
      alert(isEdit ? 'Personal actualizado' : 'Personal creado');
      onClose ? onClose() : router.back();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        {isEdit ? "Editar Personal" : "Nuevo Personal"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {!isEdit && (
          <TextField
            select
            label="Rol"
            name="idRol"
            value={form.idRol}
            onChange={handleChange}
            required
            error={!!errors.idRol}
            helperText={errors.idRol}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
        
        <TextField
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
          required
          error={!!errors.nombres}
          helperText={errors.nombres}
          inputProps={{ maxLength: 100 }}
        />
        
        <TextField
          label="Apellido Paterno"
          name="apellidoPat"
          value={form.apellidoPat}
          onChange={handleChange}
          required
          error={!!errors.apellidoPat}
          helperText={errors.apellidoPat}
          inputProps={{ maxLength: 50 }}
        />
        
        <TextField
          label="Apellido Materno"
          name="apellidoMat"
          value={form.apellidoMat}
          onChange={handleChange}
          error={!!errors.apellidoMat}
          helperText={errors.apellidoMat}
          inputProps={{ maxLength: 50 }}
        />
        
        <TextField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          error={!!errors.telefono}
          helperText={errors.telefono}
          inputProps={{ maxLength: 8 }}
        />
        
        <TextField
          label="CI"
          name="identificacion"
          value={form.identificacion}
          onChange={handleChange}
          required
          error={!!errors.identificacion}
          helperText={errors.identificacion}
          inputProps={{ maxLength: 20 }}
        />
        
        <TextField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          inputProps={{ maxLength: 200 }}
        />
        
        <TextField
          label="Correo"
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          required
          error={!!errors.correo}
          helperText={errors.correo}
          inputProps={{ maxLength: 100 }}
        />
        
        <TextField
          label="Fecha Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          required
          error={!!errors.fecha_nacimiento}
          helperText={errors.fecha_nacimiento}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: new Date().toISOString().split('T')[0] }}
        />
        
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose || (() => router.back())}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? "Actualizar" : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
