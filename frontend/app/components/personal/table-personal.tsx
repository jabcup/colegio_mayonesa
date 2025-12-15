"use client"

import { useState } from "react"
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper
} from "@mui/material"
import { api } from "@/app/lib/api"

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
  personal: Personal[]
  onEdit: (p: Personal) => void
  onView: (p: Personal) => void 
}

export default function TablePersonalActivo({ personal, onEdit, onView }: Props) {
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar a este individuo?")) return
    try {
      await api.delete(`/personal/EliminarPersonal/${id}`)
      window.location.reload()
    } catch {
      alert("Error al eliminar")
    }
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombres</TableCell>
            <TableCell>Ap. Paterno</TableCell>
            <TableCell>Ap. Materno</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>CI</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personal.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.nombres}</TableCell>
              <TableCell>{p.apellidoPat}</TableCell>
              <TableCell>{p.apellidoMat}</TableCell>
              <TableCell>{p.telefono}</TableCell>
              <TableCell>{p.identificacion}</TableCell>
              <TableCell>{p.correo}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => onView(p)}>Ver</Button>
                <Button size="small" onClick={() => onEdit(p)} sx={{ ml: 1 }}>Editar</Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleEliminar(p.id)}
                  sx={{ ml: 1 }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
