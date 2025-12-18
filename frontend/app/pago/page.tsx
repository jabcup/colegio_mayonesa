"use client"

import { useState, useEffect } from "react"
import { Button, TextField, Autocomplete } from "@mui/material"
import TablePagos from "@/app/components/pago/table-pago"
import FormPago from "@/app/components/pago/form-pago"
import { api } from "@/app/lib/api"
import Cookies from "js-cookie"
import Navbar from "../components/Navbar/navbar"

type EstudianteOption = {
  id: number
  label: string
  identificacion: string
}

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [busquedaTemp, setBusquedaTemp] = useState("")
  const [data, setData] = useState<{ pagos: any[]; estudiantes: EstudianteOption[] }>({
    pagos: [],
    estudiantes: [],
  })
  const [estudianteSel, setEstudianteSel] = useState<EstudianteOption | null>(null)

  useEffect(() => {
    Promise.all([
      api.get("/pagos"),
      api.get("/estudiante/MostrarEstudiantes"),
    ]).then(([pagosRes, estRes]) => {
      const estudiantes: EstudianteOption[] = estRes.data.map((e: any) => ({
        id: e.id,
        label: `${e.nombres} ${e.apellidoPat}`,
        identificacion: e.identificacion,
      }))

      const mapNombre = new Map(estudiantes.map(e => [e.id, e.label]))
      const mapId = new Map(estudiantes.map(e => [e.id, e.identificacion]))

      setData({
        estudiantes,
        pagos: pagosRes.data.map((p: any) => ({
          ...p,
          nombreEstudiante: mapNombre.get(p.idEstudiante) || "Desconocido",
          identificacion: mapId.get(p.idEstudiante),
        })),
      })
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaTemp), 300)
    return () => clearTimeout(timer)
  }, [busquedaTemp])

  const pagosFiltrados = data.pagos.filter(p => {
    if (busqueda === "") return true
    const q = busqueda.toLowerCase()
    return (
      p.nombreEstudiante?.toLowerCase().includes(q) ||
      p.identificacion?.toLowerCase().includes(q) ||
      String(p.idEstudiante).includes(q)
    )
  })

  const personalId = Number(Cookies.get("personal_id") ?? 0)

  const handlePagarAnio = async () => {
    if (!estudianteSel) return
    try {
      await api.patch(
        `/pagos/estudiante/${estudianteSel.id}/pagar_ultima_gestion`,
        { idpersonal: personalId }
      )
      alert("Año pagado")
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.message || error.message)
    }
  }

  const handleCreate = async () => {
    const { data: pagos } = await api.get("/pagos")
    const map = new Map(data.estudiantes.map(e => [e.id, e.label]))
    setData(prev => ({
      ...prev,
      pagos: pagos.map((p: any) => ({
        ...p,
        nombreEstudiante: map.get(p.idEstudiante) || "Desconocido",
      })),
    }))
    setShowForm(false)
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Pagos</h1>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Nuevo Pago
          </Button>
        </div>

        <TextField
          fullWidth
          label="Buscar por nombre, identificación o ID"
          value={busquedaTemp}
          onChange={e => setBusquedaTemp(e.target.value)}
          sx={{ mb: 3 }}
        />

        <div className="flex items-center gap-3 mb-4">
          <Autocomplete
            options={data.estudiantes}
            value={estudianteSel}
            onChange={(e, v) => setEstudianteSel(v)}
            getOptionLabel={(o) =>
              `${o.label} | CI: ${o.identificacion}`
            }
            filterOptions={(options, { inputValue }) => {
              const q = inputValue.toLowerCase()
              return options.filter(o =>
                o.label.toLowerCase().includes(q) ||
                o.identificacion.toLowerCase().includes(q) ||
                String(o.id).includes(q)
              )
            }}
            renderInput={(params) => (
              <TextField {...params} label="Estudiante (nombre o CI)" sx={{ width: 350 }} />
            )}
          />
          <Button
            variant="outlined"
            onClick={handlePagarAnio}
            disabled={!estudianteSel}
          >
            Pagar año actual
          </Button>
        </div>

        {showForm && (
          <FormPago
            estudiantes={data.estudiantes}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
          />
        )}

        <TablePagos pagos={pagosFiltrados} estudiantes={data.estudiantes} />
      </div>
    </>
  )
}

