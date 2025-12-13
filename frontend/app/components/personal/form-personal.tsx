"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem
} from "@mui/material"
import { api } from "@/app/lib/api"

interface Personal {
  id: number
  idRol: number
  nombres: string
  apellidoPat: string
  apellidoMat: string
  telefono: string
  identificacion: string
  direccion: string
  correo: string
  fecha_nacimiento: string
}

interface Props {
  personalToEdit?: Personal
  onClose?: () => void
}

const defaultValues: Personal = {
  id: 0,
  idRol: 1,
  nombres: "",
  apellidoPat: "",
  apellidoMat: "",
  telefono: "",
  identificacion: "",
  direccion: "",
  correo: "",
  fecha_nacimiento: ""
}

const roles = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Docente" },
  { value: 3, label: "Secretaria" }
]

export default function PersonalForm({ personalToEdit, onClose }: Props) {
  const router = useRouter()
  const isEdit = !!personalToEdit

  const [form, setForm] = useState<Personal>(defaultValues)

  useEffect(() => {
    setForm(personalToEdit ? { ...defaultValues, ...personalToEdit } : defaultValues)
  }, [personalToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    if (isEdit) {
      const { idRol, id, fecha_creacion, estado, ...payload } = form
      await api.put(`/personal/EditarPersonal/${form.id}`, payload)
    } else {
      await api.post("/personal/CrearPersonalCompleto", form)
    }
    if (onClose) onClose()
  } catch (err: any) {
    const msg = err.response?.data?.message || "Error desconocido"
    alert(isEdit ? `Error al actualizar: ${msg}` : `Error al crear: ${msg}`)
  }
}
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        {isEdit ? "Editar Personal" : "Nuevo Personal"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        {/* Select de Rol */}
        <TextField
          select
          label="Rol"
          name="idRol"
          value={form.idRol}
          onChange={handleChange}
          required
        >
          {roles.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Resto de campos */}
        <TextField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} required />
        <TextField label="Apellido Paterno" name="apellidoPat" value={form.apellidoPat} onChange={handleChange} required />
        <TextField label="Apellido Materno" name="apellidoMat" value={form.apellidoMat} onChange={handleChange} required />
        <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} required />
        <TextField label="CI" name="identificacion" value={form.identificacion} onChange={handleChange} required />
        <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required />
        <TextField label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} required />
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
  )
}
