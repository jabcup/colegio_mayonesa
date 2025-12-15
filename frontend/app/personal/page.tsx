"use client"

import { useEffect, useState, useMemo } from "react"
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Box,
  Collapse,
  TextField
} from "@mui/material"
import { api } from "@/app/lib/api"
import TablePersonalActivo from "@/app/components/personal/table-personal"
import PersonalForm from "@/app/components/personal/form-personal"
import DetallePersonal from "../components/personal/detalle-personal"

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
  fecha_creacion: string
  estado: string
}

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Personal | undefined>()
  const [textoBusqueda, setTextoBusqueda] = useState("")
  const [verPersonal, setVerPersonal] = useState<Personal | null>(null)

  const fetchPersonal = () =>
    api
      .get("/personal/PersonalActivo")
      .then((res) => setPersonal(res.data))
      .catch(() => alert("Error al cargar personal"))
      .finally(() => setLoading(false))

  useEffect(() => {
    fetchPersonal()
  }, [])

  const personalFiltrado = useMemo(() => {
    if (!textoBusqueda) return personal
    const low = textoBusqueda.toLowerCase()
    return personal.filter(
      (p) =>
        p.nombres.toLowerCase().includes(low) ||
        p.apellidoPat.toLowerCase().includes(low) ||
        p.apellidoMat.toLowerCase().includes(low) ||
        p.identificacion.toLowerCase().includes(low)
    )
  }, [personal, textoBusqueda])

  const despuesDeGuardar = () => {
    setMostrarForm(false)
    setEditando(undefined)
    fetchPersonal()
  }

  const handleNuevo = () => {
    setEditando(undefined)
    setMostrarForm(true)
  }

  const handleEditar = (p: Personal) => {
    setEditando(p)
    setMostrarForm(true)
  }

  const handleVer = (p: Personal) => setVerPersonal(p)
  const cerrarVer = () => setVerPersonal(null)

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Personal Activo</Typography>
        <Button variant="contained" onClick={handleNuevo}>
          Nuevo
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Buscar por nombre, apellido o CI"
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Collapse in={mostrarForm} unmountOnExit>
        <Box mb={3}>
          <PersonalForm personalToEdit={editando} onClose={despuesDeGuardar} />
        </Box>
      </Collapse>

      <TablePersonalActivo
        personal={personalFiltrado}
        onEdit={handleEditar}
        onView={handleVer}
      />

      <DetallePersonal
        open={!!verPersonal}
        onClose={cerrarVer}
        personal={verPersonal}
      />
    </Container>
  )
}
