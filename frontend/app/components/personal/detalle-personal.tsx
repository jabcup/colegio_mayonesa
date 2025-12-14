"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material"

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

interface Props {
  open: boolean
  onClose: () => void
  personal: Personal | null
}

export default function DetallePersonal({ open, onClose, personal }: Props) {
  if (!personal) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle del Personal</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography><strong>Nombres:</strong> {personal.nombres}</Typography>
          <Typography><strong>Ap. Paterno:</strong> {personal.apellidoPat}</Typography>
          <Typography><strong>Ap. Materno:</strong> {personal.apellidoMat}</Typography>
          <Typography><strong>CI:</strong> {personal.identificacion}</Typography>
          <Typography><strong>Teléfono:</strong> {personal.telefono}</Typography>
          <Typography><strong>Correo:</strong> {personal.correo}</Typography>
          <Typography><strong>Dirección:</strong> {personal.direccion}</Typography>
          <Typography><strong>Fecha Nac.:</strong> {personal.fecha_nacimiento}</Typography>
          <Typography><strong>Fecha Creación:</strong> {personal.fecha_creacion}</Typography>
          <Typography><strong>Estado:</strong> {personal.estado}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}
