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
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

interface Pago {
  cantidad: string;
  descuento: string;
  total: string;
  deuda: "pendiente" | "realizado";
  concepto: string;
  fecha_pago: string;
}

interface Props {
  idEstudiante: number;
}

const COLORES_PAGO: Record<string, string> = {
  pendiente: "#f0e583ff",
  realizado: "#9ce29eff",
  cancelado: "#9ce29eff",
};

type FiltroConcepto = "todos" | "mensualidad" | "otros";

export default function TablePagosEstudiante({ idEstudiante }: Props) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filtro, setFiltro] = useState<FiltroConcepto>("todos");

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchPagos = async () => {
      try {
        const res = await api.get(`/pagos/estudiante/${idEstudiante}`);
        setPagos(Array.isArray(res.data) ? res.data : res.data.pagos ?? []);

      } catch (error) {
        console.error("Error al obtener pagos", error);
      }
    };

    fetchPagos();
  }, [idEstudiante]);

  // 🔍 Filtrado por concepto
  const pagosFiltrados = useMemo(() => {
    if (filtro === "mensualidad") {
      return pagos.filter((p) =>
        p.concepto.toLowerCase().includes("mensualidad")
      );
    }

    if (filtro === "otros") {
      return pagos.filter(
        (p) => !p.concepto.toLowerCase().includes("mensualidad")
      );
    }

    return pagos;
  }, [pagos, filtro]);

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-BO");

  return (
    <TableContainer component={Paper} sx={{ width: "95%", mx: "auto" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Pagos del Estudiante</Typography>

        <FormControl size="small">
          <Select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as FiltroConcepto)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="mensualidad">Mensualidades</MenuItem>
            <MenuItem value="otros">Otros</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
            <TableCell>
              <strong>Fecha de pago</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pagosFiltrados.map((pago, index) => (
            <TableRow
              key={index}
              sx={{ backgroundColor: COLORES_PAGO[pago.deuda] }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{pago.cantidad}</TableCell>
              <TableCell>{pago.descuento}</TableCell>
              <TableCell>{pago.total}</TableCell>
              <TableCell>
                {pago.deuda.charAt(0).toUpperCase() + pago.deuda.slice(1)}
              </TableCell>
              <TableCell>{pago.concepto}</TableCell>
              <TableCell>
                {pago.deuda !== "pendiente"
                  ? formatearFecha(pago.fecha_pago)
                  : "—"}
              </TableCell>
            </TableRow>
          ))}

          {pagosFiltrados.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No hay pagos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
