"use client";

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { useState, useMemo } from "react";
import { Boton } from "../botones/botonNav";
import { api } from "@/app/lib/api";

interface Horario {
  id: number;
  horario: string;
  estado: string;
}

interface Props {
  horarios: Horario[];
  tipo: "activas" | "inactivas";
  onHorariosUpdate?: () => void;
}

export default function HorariosTable({ horarios, tipo, onHorariosUpdate }: Props) {
  // Estado para ordenamiento: true = A→Z, false = Z→A
  const [orderAsc, setOrderAsc] = useState(true);

  // Ordenar los horarios alfabéticamente
  const horariosOrdenados = useMemo(() => {
    return [...horarios].sort((a, b) => {
      const comparacion = a.horario.toLowerCase().localeCompare(b.horario.toLowerCase());
      return orderAsc ? comparacion : -comparacion;
    });
  }, [horarios, orderAsc]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este horario?")) return;

    try {
      await api.delete(`/horarios/EliminarHorario/${id}`);
      alert("Horario eliminado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al eliminar horario");
    }
  };

  const handleEditar = async (id: number) => {
    const nuevoHorario = prompt("Ingrese el nuevo lapso de tiempo (ej: 07:00 - 08:00)");
    if (!nuevoHorario?.trim()) return;

    try {
      await api.put(`/horarios/EditarHorario/${id}`, { horario: nuevoHorario.trim() });
      alert("Horario actualizado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al actualizar horario");
    }
  };

  const handleReactivar = async (id: number) => {
    try {
      await api.put(`/horarios/reactivarHorario/${id}`);
      alert("Horario reactivado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al reactivar horario");
    }
  };

  const toggleOrder = () => {
    setOrderAsc((prev) => !prev);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Botón de ordenar arriba de la tabla */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" fontWeight="medium">
          Ordenar por horario:
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={
            orderAsc ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />
          }
          onClick={toggleOrder}
          sx={{ textTransform: "none", boxShadow: 2 }}
        >
          {orderAsc ? "A → Z" : "Z → A"}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          Total: {horarios.length} horario{horarios.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Horario</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {horariosOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay horarios {tipo === "activas" ? "activos" : "inactivos"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              horariosOrdenados.map((h) => (
                <TableRow key={h.id} hover>
                  <TableCell>{h.horario}</TableCell>
                  <TableCell>
                    {tipo === "activas" ? (
                      <>
                        <Boton
                          label="Editar"
                          color="primary"
                          size="small"
                          onClick={() => handleEditar(h.id)}
                        />
                        <Boton
                          label="Eliminar"
                          color="error"
                          size="small"
                          className="ml-2"
                          onClick={() => handleEliminar(h.id)}
                        />
                      </>
                    ) : (
                      <Boton
                        label="Reactivar"
                        color="success"
                        size="small"
                        onClick={() => handleReactivar(h.id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}