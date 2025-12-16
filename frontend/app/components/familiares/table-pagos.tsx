"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

interface Pago {
  cantidad: string;
  descuento: string;
  total: string;
  deuda: "pendiente" | "realizado";
  concepto: string;
}

interface Props {
  idEstudiante: number;
}

const COLORES_PAGO: Record<string, string> = {
  pendiente: "#FFF9C4",
  realizado: "#C8E6C9",
};

export default function TablePagosEstudiante({ idEstudiante }: Props) {
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchPagos = async () => {
      try {
        const res = await api.get(`/pagos/${idEstudiante}`);
        setPagos(res.data);
      } catch (error) {
        console.error("Error al obtener pagos", error);
      }
    };

    fetchPagos();
  }, [idEstudiante]);

  return (
    <TableContainer component={Paper} sx={{ width: "95%", mx: "auto" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Pagos del Estudiante
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>#</strong>
            </TableCell>
            <TableCell>
              <strong>Cantidad</strong>
            </TableCell>
            <TableCell>
              <strong>Descuento</strong>
            </TableCell>
            <TableCell>
              <strong>Total</strong>
            </TableCell>
            <TableCell>
              <strong>Estado</strong>
            </TableCell>
            <TableCell>
              <strong>Concepto</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pagos.map((pago, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: COLORES_PAGO[pago.deuda],
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{pago.cantidad}</TableCell>
              <TableCell>{pago.descuento}</TableCell>
              <TableCell>{pago.total}</TableCell>
              <TableCell>
                {pago.deuda.charAt(0).toUpperCase() + pago.deuda.slice(1)}
              </TableCell>
              <TableCell>{pago.concepto}</TableCell>
            </TableRow>
          ))}

          {pagos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay pagos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
