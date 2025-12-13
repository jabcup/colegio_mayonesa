"use client"

import { useEffect, useState } from "react"
import { CircularProgress, Container, Typography, Button, Box, Collapse } from "@mui/material"
import { api } from "@/app/lib/api"
import TablePersonalActivo from "@/app/components/personal/table-personal"
import FormPersonal from "@/app/components/personal/form-personal"

interface Personal {
  id: number
  nombres: string
  apellidoPat: string
  apellidoMat: string
  telefono: string
  identificacion: string
  direccion: string
  correo: string
  fecha_nacimiento: string
  fecha_creacion: string
  estado: string
}

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  const fetchPersonal = () =>
    api.get("/personal/PersonalActivo")
      .then((res) => setPersonal(res.data))
      .catch(() => alert("Error al cargar personal"))
      .finally(() => setLoading(false))

  useEffect(() => {
    fetchPersonal()
  }, [])

  const despuesDeGuardar = () => {
    setMostrarForm(false)
    fetchPersonal()
  }

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Personal Activo</Typography>
        <Button variant="contained" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? "Cancelar" : "Nuevo"}
        </Button>
      </Box>

      <Collapse in={mostrarForm} unmountOnExit>
        <Box mb={3}>
          <FormPersonal onGuardado={despuesDeGuardar} />
        </Box>
      </Collapse>

      <TablePersonalActivo personal={personal} />
    </Container>
  )
}
