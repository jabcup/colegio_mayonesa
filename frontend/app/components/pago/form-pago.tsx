"use client"

import { useState, useEffect } from "react"
import { Button, TextField, MenuItem } from "@mui/material"
import { api } from "@/app/lib/api"
import Cookies from "js-cookie"

interface Estudiante {
  id: number
  nombres: string
  apellidoPat: string
}

interface Pago {
  id?: number
  idEstudiante: number
  cantidad: number
  descuento: number
  total: number
  concepto: string
  deuda: "pendiente" | "cancelado"
}

interface Props {
  estudiantes?: Estudiante[]
  onClose: () => void
  onCreate: () => void
  pagoInicial?: Pago
}

export default function FormPago({ estudiantes = [], onClose, onCreate, pagoInicial }: Props) {
  const [form, setForm] = useState({
    idEstudiante: "",
    cantidad: "",
    descuento: "0",
    concepto: "",
    deuda: "pendiente" as "pendiente" | "cancelado"
  })

  const esEdicion = !!pagoInicial
  const personalId = Number(Cookies.get('personal_id') ?? 0)

  useEffect(() => {
    if (esEdicion) {
      setForm({
        idEstudiante: pagoInicial.idEstudiante.toString(),
        cantidad: pagoInicial.cantidad.toString(),
        descuento: pagoInicial.descuento.toString(),
        concepto: pagoInicial.concepto,
        deuda: pagoInicial.deuda
      })
    }
  }, [esEdicion, pagoInicial])

  const total = Number(form.cantidad) - Number(form.descuento)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      idEstudiante: Number(form.idEstudiante),
      idPersonal: personalId,
      cantidad: Number(form.cantidad),
      descuento: Number(form.descuento),
      total,
      concepto: form.concepto,
      deuda: form.deuda
    }
    try {
      if (esEdicion) {
        await api.patch(`/pagos/${pagoInicial!.id}`, payload)
      } else {
        await api.post("/pagos", payload)
      }

      onCreate()
      onClose()
    } catch (error) {
      alert("Error al guardar pago")
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md">
      {estudiantes.length === 0 ? (
        <TextField fullWidth disabled label="Cargando estudiantes..." />
      ) : (
        <TextField
          select
          fullWidth
          label="Estudiante"
          value={form.idEstudiante}
          onChange={(e) => setForm({ ...form, idEstudiante: e.target.value })}
          required
          disabled={esEdicion}
          SelectProps={{ MenuProps: { sx: { maxHeight: 300 } } }}
        >
{estudiantes.map((est) => (
  <MenuItem key={est.id} value={est.id} sx={{ minHeight: 36 }}>
    {est.label}
  </MenuItem>
))}{estudiantes.map((est, idx) => {
  console.log(idx, est) // ← verifica aquí
  return (
    <MenuItem key={est.id} value={est.id} sx={{ minHeight: 36 }}>
      {est.nombres} {est.apellidoPat}
    </MenuItem>
  )
})}          {estudiantes.map((est) => (
            <MenuItem key={est.id} value={est.id} sx={{ minHeight: 36 }}>
              {est.nombres} {est.apellidoPat}
            </MenuItem>
          ))}
        </TextField>
      )}

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
        label="Concepto"
        value={form.concepto}
        onChange={(e) => setForm({ ...form, concepto: e.target.value })}
        required
      />

      <TextField
        select
        fullWidth
        label="Estado"
        value={form.deuda}
        onChange={(e) => setForm({ ...form, deuda: e.target.value as any })}
      >
        <MenuItem value="pendiente">Pendiente</MenuItem>
        <MenuItem value="cancelado">Cancelado</MenuItem>
      </TextField>

      <TextField fullWidth disabled label="Total" value={total.toFixed(2)} />

      <div className="flex gap-2">
        <Button type="submit" variant="contained">
          {esEdicion ? "Actualizar Pago" : "Crear Pago"}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
