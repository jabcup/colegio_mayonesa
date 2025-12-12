"use client"

//volver a poner la identificacion

import { useState, useEffect } from "react"
import { Button, TextField } from "@mui/material"
import TablePagos from "@/app/components/pago/table-pago"
import FormPago from "@/app/components/pago/form-pago"
import { api } from "@/app/lib/api"

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [busquedaTemp, setBusquedaTemp] = useState("") 
  const [data, setData] = useState({ pagos: [], estudiantes: [] })

  useEffect(() => {
    Promise.all([
      api.get('/pagos'),
      api.get('/estudiante/MostrarEstudiantes')
    ]).then(([pagosRes, estudiantesRes]) => {
      const pagos = pagosRes.data
      const estudiantes = estudiantesRes.data
      
      const estudiantesMap = new Map(
        estudiantes.map(est => [
          est.id, 
          { nombre: est.nombres, identificacion: est.identificacion }
        ])
      )
      
      const pagosCompletos = pagos.map(pago => ({
        ...pago,
        nombreEstudiante: estudiantesMap.get(pago.idEstudiante)?.nombre || 'Desconocido',
        identificacion: estudiantesMap.get(pago.idEstudiante)?.identificacion || 'Sin CI'
      }))
      
      setData({ pagos: pagosCompletos, estudiantes })
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaTemp), 300)
    return () => clearTimeout(timer)
  }, [busquedaTemp])

  const pagosFiltrados = data.pagos.filter(pago => 
    busqueda === "" || 
    pago.nombreEstudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
    pago.identificacion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleCreate = async () => {
    const fresh = await Promise.all([
      api.get('/pagos'),
      api.get('/estudiante/MostrarEstudiantes')
    ])
    
    const [pagosRes, estudiantesRes] = fresh
    const estudiantesMap = new Map(
      estudiantesRes.data.map(est => [
        est.id, 
        { nombre: est.nombres, identificacion: est.identificacion }
      ])
    )
    
    const pagosCompletos = pagosRes.data.map(pago => ({
      ...pago,
      nombreEstudiante: estudiantesMap.get(pago.idEstudiante)?.nombre || 'Desconocido',
      identificacion: estudiantesMap.get(pago.idEstudiante)?.identificacion || 'Sin CI'
    }))
    
    setData({ pagos: pagosCompletos, estudiantes: estudiantesRes.data })
    setShowForm(false)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Nuevo Pago
        </Button>
      </div>

      <TextField
        fullWidth
        label="Buscar por nombre o identificación"
        value={busquedaTemp}
        onChange={(e) => setBusquedaTemp(e.target.value)}
        sx={{ mb: 3 }}
      />

      {showForm && (
        <FormPago 
          estudiantes={data.estudiantes}
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      <TablePagos pagos={pagosFiltrados} />
    </div>
  )
}
