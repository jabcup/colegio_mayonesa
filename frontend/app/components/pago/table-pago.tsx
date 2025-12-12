"use client"

import { useState } from "react"
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material"
import { api } from "@/app/lib/api"
import DetallePago from "./detalle-pago"

interface Pago {
  id: number;
  idEstudiante: number;
  nombreEstudiante: string;
  cantidad: number;
  descuento: number;
  total: number;
}

interface Props {
  pagos: Pago[]
}

export default function TablePagos({ pagos }: Props) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null)

  const handleVer = async (pagoId: number) => {
    try {
      const response = await api.get(`/pagos/${pagoId}`)
      setPagoSeleccionado(response.data)
    } catch (error) {
      alert("Error al cargar detalles")
    }
  }

  const handlePagar = async (pagoId: number) => {
    try {
      await api.patch(`/pagos/pagar/${pagoId}`, { idpersonal: 5 })
      alert("Pago realizado")
      window.location.reload()
    } catch (error) {
      alert("Error al pagar")
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombreEstudiante}</TableCell>
                <TableCell>{p.cantidad}</TableCell>
                <TableCell>{p.descuento}</TableCell>
                <TableCell>{p.total}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleVer(p.id)}>
                    Ver
                  </Button>
                  <Button 
                    size="small" 
                    color="success"
                    onClick={() => handlePagar(p.id)}
                    sx={{ ml: 1 }}
                  >
                    Pagar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagoSeleccionado && (
        <DetallePago 
          pago={pagoSeleccionado} 
          onClose={() => setPagoSeleccionado(null)} 
        />
      )}
    </>
  )
}
