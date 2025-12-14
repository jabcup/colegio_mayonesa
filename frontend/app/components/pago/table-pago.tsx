"use client"

import { useState } from "react"
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField } from "@mui/material"
import { api } from "@/app/lib/api"
import DetallePago from "./detalle-pago"
import FormPago from "./form-pago"

interface Pago {
  id: number
  idEstudiante: number
  nombreEstudiante: string
  cantidad: number
  descuento: number
  total: number
  deuda: "pendiente" | "cancelado"
  concepto: string
  fecha_creacion: string
}

interface Props {
  pagos: Pago[]
  estudiantes: { id: number; nombres: string; apellidoPat: string }[]
}

export default function TablePagos({ pagos, estudiantes }: Props) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null)
  const [anioFiltro, setAnioFiltro] = useState("")
  const [pagoAEditar, setPagoAEditar] = useState<Pago | undefined>()

const visibles = pagos.filter(p => p.estado === 'activo')
const filtered = anioFiltro
  ? visibles.filter(p => new Date(p.fecha_creacion).getFullYear().toString() === anioFiltro)
  : visibles
  const handleVer = async (pagoId: number) => {
    try {
      const { data } = await api.get<Pago>(`/pagos/${pagoId}`)
      setPagoSeleccionado(data)
    } catch {
      alert("Error al cargar detalles")
    }
  }

  const handlePagar = async (pagoId: number) => {
    try {
      await api.patch(`/pagos/pagar/${pagoId}`, { idpersonal: 1 })
      alert("Pago realizado")
      window.location.reload()
    } catch {
      alert("Error al pagar")
    }
  }

  const handleActualizar = (p: Pago) => setPagoAEditar(p)
  const handleCerrarForm = () => setPagoAEditar(undefined)
  const handleRecargar = () => window.location.reload()

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Confirma eliminar este pago?")) return
    try {
      await api.delete(`/pagos/${id}`)
      window.location.reload()
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al eliminar")
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-3">
        <TextField
          label="Filtrar por año"
          type="number"
          placeholder="2025"
          value={anioFiltro}
          onChange={e => setAnioFiltro(e.target.value)}
          sx={{ width: 160 }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombreEstudiante}</TableCell>
                <TableCell>{p.concepto}</TableCell>
                <TableCell>{new Date(p.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>{p.cantidad}</TableCell>
                <TableCell>{p.descuento}</TableCell>
                <TableCell>{p.total}</TableCell>
                <TableCell>{p.deuda}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleVer(p.id)}>Ver</Button>
                  {p.deuda === "pendiente" && (
                    <Button size="small" color="success" onClick={() => handlePagar(p.id)} sx={{ ml: 1 }}>
                      Pagar
                    </Button>
                  )}
                  <Button size="small" onClick={() => handleActualizar(p)} sx={{ ml: 1 }}>
                    Actualizar
                  </Button>
                  <Button size="small" color="error" onClick={() => handleEliminar(p.id)} sx={{ ml: 1 }}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagoSeleccionado && (
        <DetallePago pago={pagoSeleccionado} onClose={() => setPagoSeleccionado(null)} />
      )}

      {pagoAEditar && (
        <FormPago
          estudiantes={estudiantes}
          pagoInicial={pagoAEditar}
          onCreate={handleRecargar}
          onClose={handleCerrarForm}
        />
      )}
    </>
  )
}
