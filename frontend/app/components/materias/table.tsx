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

interface Materia {
  id: number;
  nombre: string;
  estado: string;
}

interface Props {
  materias: Materia[];
  tipo: "activas" | "inactivas";
  onMateriasUpdate?: () => void;
}

export default function MateriasTable({ materias, tipo, onMateriasUpdate }: Props) {
  // Estado para ordenamiento
  const [orderAsc, setOrderAsc] = useState(true); // true = A→Z, false = Z→A

  // Ordenar las materias
  const materiasOrdenadas = useMemo(() => {
    return [...materias].sort((a, b) => {
      const comparacion = a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
      return orderAsc ? comparacion : -comparacion;
    });
  }, [materias, orderAsc]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta materia?")) return;

    try {
      await api.delete(`/materias/EliminarMateria/${id}`);
      alert("Materia eliminada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al eliminar materia");
    }
  };

  const handleEditar = async (id: number) => {
    const nuevoNombre = prompt("Ingrese el nuevo nombre de la materia");
    if (!nuevoNombre?.trim()) return;

    try {
      await api.put(`/materias/EditarMateria/${id}`, { nombre: nuevoNombre.trim() });
      alert("Materia actualizada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al actualizar materia");
    }
  };

  const handleReactivar = async (id: number) => {
    try {
      await api.put(`/materias/reactivarMateria/${id}`);
      alert("Materia reactivada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al reactivar materia");
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
          Ordenar por nombre:
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
          Total: {materias.length} materia{materias.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiasOrdenadas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay materias {tipo === "activas" ? "activas" : "inactivas"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              materiasOrdenadas.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>
                    {tipo === "activas" ? (
                      <>
                        <Boton
                          label="Editar"
                          color="primary"
                          size="small"
                          onClick={() => handleEditar(m.id)}
                        />
                        <Boton
                          label="Eliminar"
                          color="error"
                          size="small"
                          className="ml-2"
                          onClick={() => handleEliminar(m.id)}
                        />
                      </>
                    ) : (
                      <Boton
                        label="Reactivar"
                        color="success"
                        size="small"
                        onClick={() => handleReactivar(m.id)}
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