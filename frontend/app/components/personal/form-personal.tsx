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
  apellidoMat: string;
  telefono: string;
  identificacion: string;
  direccion: string;
  correo: string;
  fecha_nacimiento: string;
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

  useEffect(() => {
    api
      .get("/roles/MostrarRoles")
      .then((r) => setRoles(r.data))
      .catch(() => alert("Error al cargar roles"));
  }, []);

  useEffect(
    () =>
      setForm(
        personalToEdit ? { ...defaultValues, ...personalToEdit } : defaultValues
      ),
    [personalToEdit]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nombres.trim() ||
      !form.apellidoPat.trim() ||
      !form.identificacion.trim() ||
      !form.correo.trim()
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }
    if (!/^\d+$/.test(form.identificacion)) {
      alert("CI solo números");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      alert("Correo inválido");
      return;
    }
    if (form.telefono && !/^\d+$/.test(form.telefono)) {
      alert("Teléfono solo números");
      return;
    }
    try {
      const { id, fecha_creacion, estado, ...payload } = form;
      isEdit
        ? await api.put(`/personal/EditarPersonal/${form.id}`, payload)
        : await api.post("/personal/CrearPersonalCompleto", payload);
      alert(isEdit ? "Personal actualizado" : "Personal creado");
      onClose ? onClose() : router.back();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al guardar");
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
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Apellido Paterno"
          name="apellidoPat"
          value={form.apellidoPat}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50 }}
        />
        <TextField
          label="Apellido Materno"
          name="apellidoMat"
          value={form.apellidoMat}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50 }}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="CI"
          name="identificacion"
          value={form.identificacion}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="Correo"
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Fecha Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
        />
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose || router.back}>
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
