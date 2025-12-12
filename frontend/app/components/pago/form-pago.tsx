"use client"

import { useState } from "react"
import { Button, TextField, MenuItem } from "@mui/material"
import { api } from "@/app/lib/api"

interface Estudiante {
  id: number
  nombres: string
  apellidoPat: string
}

interface Props {
  estudiantes: Estudiante[]
  onClose: () => void
  onCreate: () => void
}

export default function FormPago({ estudiantes, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    idEstudiante: "",
    cantidad: "",
    descuento: "0"
  })

  const total = Number(form.cantidad) - Number(form.descuento)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await api.post("/pagos", {
        idEstudiante: Number(form.idEstudiante),
        idPersonal: 6, // Hardcodeado
        cantidad: Number(form.cantidad),
        descuento: Number(form.descuento),
        total: total
      })
      
      onCreate()
      onClose()
    } catch (error) {
      alert("Error al crear pago")
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md">
      <TextField
        select
        fullWidth
        label="Estudiante"
        value={form.idEstudiante}
        onChange={(e) => setForm({ ...form, idEstudiante: e.target.value })}
        required
      >
        {estudiantes.map((est) => (
          <MenuItem key={est.id} value={est.id}>
            {est.nombres} {est.apellidoPat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Cantidad"
        value={form.cantidad}
        onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
        required
      />

      <TextField
        fullWidth
        type="number"
        label="Descuento"
        value={form.descuento}
        onChange={(e) => setForm({ ...form, descuento: e.target.value })}
      />

      <TextField
        fullWidth
        disabled
        label="Total"
        value={total.toFixed(2)}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="contained">
          Crear Pago
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
