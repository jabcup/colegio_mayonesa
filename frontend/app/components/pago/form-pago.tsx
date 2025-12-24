"use client"

import { useState, useEffect } from "react"
import { Button, TextField, MenuItem, Autocomplete } from "@mui/material"
import { api } from "@/app/lib/api"
import Cookies from "js-cookie"

interface Estudiante {
  id: number
  label: string
  identificacion?: string
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
  const [estudianteSel, setEstudianteSel] = useState<Estudiante | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const esEdicion = !!pagoInicial
  const personalId = Number(Cookies.get('personal_id') ?? 0)
  const conceptoEsMensualidad = esEdicion && pagoInicial?.concepto?.startsWith("Mensualidad")

  useEffect(() => {
    if (esEdicion) {
      const est = estudiantes.find(e => e.id === pagoInicial.idEstudiante)
      if (est) setEstudianteSel(est)
      
      setForm({
        idEstudiante: pagoInicial.idEstudiante.toString(),
        cantidad: pagoInicial.cantidad.toString(),
        descuento: pagoInicial.descuento.toString(),
        concepto: pagoInicial.concepto,
        deuda: pagoInicial.deuda
      })
    }
  }, [esEdicion, pagoInicial, estudiantes])

  useEffect(() => {
    if (estudianteSel) {
      setForm(prev => ({ ...prev, idEstudiante: estudianteSel.id.toString() }))
    }
  }, [estudianteSel])

  const total = Number(form.cantidad) - Number(form.descuento)

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.idEstudiante) {
      newErrors.idEstudiante = "Debe seleccionar un estudiante"
    }
    
    if (!form.cantidad || Number(form.cantidad) <= 0) {
      newErrors.cantidad = "Debe ingresar una cantidad válida"
    }
    
    if (form.descuento && Number(form.descuento) < 0) {
      newErrors.descuento = "El descuento no puede ser negativo"
    }
    
    if (Number(form.cantidad) > 0 && Number(form.descuento) >= Number(form.cantidad)) {
      newErrors.descuento = "El descuento no puede ser mayor o igual a la cantidad"
    }
    
    if (!form.concepto.trim()) {
      newErrors.concepto = "El concepto es requerido"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }
    
    const payload = {
      idEstudiante: Number(form.idEstudiante),
      idPersonal: personalId,
      cantidad: Number(form.cantidad),
      descuento: Number(form.descuento),
      total,
      concepto: form.concepto.trim(),
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
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al guardar")
    }
  }

  const handleCantidadChange = (value: string) => {
    setForm({ ...form, cantidad: value })
    if (errors.cantidad) setErrors({ ...errors, cantidad: "" })
    
    if (errors.descuento && Number(value) > 0 && Number(form.descuento) < Number(value)) {
      setErrors({ ...errors, descuento: "" })
    }
  }

  const handleDescuentoChange = (value: string) => {
    setForm({ ...form, descuento: value })
    if (errors.descuento) setErrors({ ...errors, descuento: "" })
  }

  const handleConceptoChange = (value: string) => {
    if (!conceptoEsMensualidad) {
      setForm({ ...form, concepto: value })
      if (errors.concepto) setErrors({ ...errors, concepto: "" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md">
      {estudiantes.length === 0 ? (
        <TextField fullWidth disabled label="Cargando estudiantes..." />
      ) : (
        <Autocomplete
          options={estudiantes}
          value={estudianteSel}
          onChange={(e, v) => setEstudianteSel(v)}
          getOptionLabel={(o) => {
            if (o.identificacion) {
              return `${o.label} | CI: ${o.identificacion}`
            }
            return o.label
          }}
          filterOptions={(options, { inputValue }) => {
            const q = inputValue.toLowerCase()
            return options.filter(o =>
              o.label.toLowerCase().includes(q) ||
              o.identificacion?.toLowerCase().includes(q) ||
              String(o.id).includes(q)
            )
          }}
          disabled={esEdicion}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Estudiante (nombre o CI)" 
              required
              error={!!errors.idEstudiante}
              helperText={errors.idEstudiante}
            />
          )}
        />
      )}

      <TextField
        fullWidth
        type="number"
        label="Cantidad"
        value={form.cantidad}
        onChange={(e) => handleCantidadChange(e.target.value)}
        required
        error={!!errors.cantidad}
        helperText={errors.cantidad}
        inputProps={{ min: 0, step: 0.01 }}
      />

      <TextField
        fullWidth
        type="number"
        label="Descuento"
        value={form.descuento}
        onChange={(e) => handleDescuentoChange(e.target.value)}
        error={!!errors.descuento}
        helperText={errors.descuento}
        inputProps={{ min: 0, step: 0.01 }}
      />

      <TextField
        fullWidth
        label="Concepto"
        value={form.concepto}
        onChange={(e) => handleConceptoChange(e.target.value)}
        required
        disabled={conceptoEsMensualidad}
        error={!!errors.concepto}
        helperText={errors.concepto}
        inputProps={{ maxLength: 150 }}
        placeholder={conceptoEsMensualidad ? "Concepto de mensualidad no editable" : ""}
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
