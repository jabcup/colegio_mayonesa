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
  Paper,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { api } from "@/app/lib/api"
import DetallePago from "./detalle-pago"
import FormPago from "./form-pago"
import Cookies from "js-cookie"

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
  estado: "activo" | "inactivo"
}

interface Props {
  pagos: Pago[]
  estudiantes: { id: number; nombres: string; apellidoPat: string }[]
  onUpdate?: () => void | Promise<void> 
}

export default function TablePagos({ pagos, estudiantes, onUpdate }: Props) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null)
  const [anioFiltro, setAnioFiltro] = useState("")
  const [pagoAEditar, setPagoAEditar] = useState<Pago | undefined>()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [confirm, setConfirm] = useState<{ open: boolean; pagoId: number; total: number }>({ open: false, pagoId: 0, total: 0 })

  const personalId = Number(Cookies.get('personal_id') ?? 0)

  const visibles = pagos.filter(p => p.estado === 'activo')
  const filtered = anioFiltro
    ? visibles.filter(p => new Date(p.fecha_creacion).getFullYear().toString() === anioFiltro)
    : visibles

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleVer = async (pagoId: number) => {
    try {
      const { data } = await api.get<Pago>(`/pagos/${pagoId}`)
      setPagoSeleccionado(data)
    } catch {
      alert("Error al cargar detalles")
    }
  }

  const handlePagar = async () => {
    const { pagoId } = confirm
    try {
      await api.patch(`/pagos/pagar/${pagoId}`, { idpersonal: personalId })
<<<<<<< HEAD
=======
// <<<<<<< HEAD
>>>>>>> j

      const pdfRes = await api.get(`/pagos/comprobante/${pagoId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `comprobante-${pagoId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setConfirm({ open: false, pagoId: 0, total: 0 })
      
      await onUpdate?.()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al pagar')
<<<<<<< HEAD
=======
// =======
      // alert("Pago realizado")
      // window.location.reload()
    // } catch {
      // alert("Error al pagar, debes ser un Cajero para poder realziar el pago")
// >>>>>>> charu
>>>>>>> j
    }
  }

  const handleActualizar = (p: Pago) => setPagoAEditar(p)
  const handleCerrarForm = () => setPagoAEditar(undefined)

  const handleEliminar = async (id: number) => {
    if (typeof window === 'undefined' || !window.confirm('¿Confirma eliminar este pago?')) return
    try {
      await api.delete(`/pagos/${id}`)
      await onUpdate?.()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al eliminar')
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleActualizarYRecargar = async () => {
    handleCerrarForm()
    await onUpdate?.()
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
            {paginated.map((p) => (
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
                    <Button size="small" color="success" onClick={() => setConfirm({ open: true, pagoId: p.id, total: p.total })} sx={{ ml: 1 }}>
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />

      {/* Modal para ver detalle */}
      <Dialog open={!!pagoSeleccionado} onClose={() => setPagoSeleccionado(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle del pago
          <IconButton
            aria-label="close"
            onClick={() => setPagoSeleccionado(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {pagoSeleccionado && <DetallePago pago={pagoSeleccionado} onClose={() => setPagoSeleccionado(null)} />}
        </DialogContent>
      </Dialog>

      {/* Modal para actualizar */}
      <Dialog open={!!pagoAEditar} onClose={handleCerrarForm} maxWidth="md" fullWidth>
        <DialogTitle>
          Actualizar pago
          <IconButton
            aria-label="close"
            onClick={handleCerrarForm}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {pagoAEditar && (
            <FormPago
              estudiantes={estudiantes}
              pagoInicial={pagoAEditar}
              onCreate={handleActualizarYRecargar}
              onClose={handleCerrarForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmación y descarga */}
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, pagoId: 0, total: 0 })} maxWidth="xs">
        <DialogTitle>Confirmar pago</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Concepto: {pagos.find(p => p.id === confirm.pagoId)?.concepto}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Total: {confirm.total}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, pagoId: 0, total: 0 })}>Cancelar</Button>
          <Button variant="contained" onClick={handlePagar}>Pagar y descargar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
