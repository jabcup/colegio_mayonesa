"use client"

import { useState, useEffect } from "react"
import { Button, TextField, Autocomplete } from "@mui/material"
import TablePagos from "@/app/components/pago/table-pago"
import FormPago from "@/app/components/pago/form-pago"
import { api } from "@/app/lib/api"
import Cookies from "js-cookie"
import Navbar from "../components/Navbar/navbar"

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [busquedaTemp, setBusquedaTemp] = useState("")
  const [data, setData] = useState({ pagos: [], estudiantes: [] })
  const [estudianteSel, setEstudianteSel] = useState<{ id: number; label: string } | null>(null)

  useEffect(() => {
    Promise.all([api.get('/pagos'), api.get('/estudiante/MostrarEstudiantes')]).then(([pagosRes, estRes]) => {
      const estudiantes = estRes.data.map(e => ({ id: e.id, label: `${e.nombres} ${e.apellidoPat}` }))
      const map = new Map(estRes.data.map(e => [e.id, e.identificacion]))
      setData({
        pagos: pagosRes.data.map(p => ({ ...p, nombreEstudiante: estudiantes.find(e => e.id === p.idEstudiante)?.label || 'Desconocido', identificacion: map.get(p.idEstudiante) })),
        estudiantes
      })
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaTemp), 300)
    return () => clearTimeout(timer)
  }, [busquedaTemp])

  const pagosFiltrados = data.pagos.filter(p =>
    busqueda === "" ||
    p.nombreEstudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.identificacion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const personalId = Number(Cookies.get('personal_id') ?? 0)

  if (showForm && !data.estudiantes.length)
    return <div className="p-4">Cargando estudiantes...</div>

  const handlePagarAnio = async () => {
    if (!estudianteSel) return
    try {
      await api.patch(`/pagos/estudiante/${estudianteSel.id}/pagar_ultima_gestion`, { idpersonal: personalId })
      alert("Año pagado")
      window.location.reload()
    } catch (error: any) {
      console.error("Error completo:", error)
      alert(`Error al pagar año: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleCreate = async () => {
    const { data: pagos } = await api.get('/pagos')
    const map = new Map(data.estudiantes.map(e => [e.id, e.label]))
    setData(prev => ({ ...prev, pagos: pagos.map(p => ({ ...p, nombreEstudiante: map.get(p.idEstudiante) || 'Desconocido' })) }))
    setShowForm(false)
  }

  return (<>
  <Navbar/>
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Button variant="contained" onClick={() => setShowForm(true)}>Nuevo Pago</Button>
      </div>

      <TextField fullWidth label="Buscar por nombre o identificación" value={busquedaTemp} onChange={e => setBusquedaTemp(e.target.value)} sx={{ mb: 3 }} />

      <div className="flex items-center gap-3 mb-4">
        <Autocomplete
          options={data.estudiantes}
          value={estudianteSel}
          onChange={(e, v) => setEstudianteSel(v)}
          renderInput={(params) => <TextField {...params} label="Estudiante" sx={{ width: 300 }} />}
        />
        <Button variant="outlined" onClick={handlePagarAnio} disabled={!estudianteSel}>
          Pagar año actual
        </Button>
      </div>

      {showForm && <FormPago estudiantes={data.estudiantes} onClose={() => setShowForm(false)} onCreate={handleCreate} />}
      <TablePagos pagos={pagosFiltrados} estudiantes={data.estudiantes} />
    </div>
    </>
  )
}
