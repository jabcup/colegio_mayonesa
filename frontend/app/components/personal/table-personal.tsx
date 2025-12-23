"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import {
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { api } from "@/app/lib/api";

interface Personal {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  telefono: string;
  identificacion: string;
  direccion: string;
  correo: string;
  fecha_nacimiento: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  personal: Personal[];
  onEdit: (p: Personal) => void;
  onView: (p: Personal) => void;
}

export default function TablePersonalActivo({ personal, onEdit, onView }: Props) {
  // Estado para ordenamiento
  const [sortBy, setSortBy] = useState<"nombres" | "apellidoPat" | "ci">("apellidoPat");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar a este individuo?")) return;
    try {
      await api.delete(`/personal/EliminarPersonal/${id}`);
      window.location.reload();
    } catch {
      alert("Error al eliminar");
    }
  };

  // Función para alternar orden
  const toggleSort = (field: "nombres" | "apellidoPat" | "ci") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Ícono según el estado
  const getSortIcon = (field: "nombres" | "apellidoPat" | "ci") => {
    if (sortBy !== field) return <SortIcon fontSize="small" sx={{ opacity: 0.4 }} />;
    return sortOrder === "asc" ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  // Lista ordenada
  const personalOrdenado = useMemo(() => {
    return [...personal].sort((a, b) => {
      let valA: string = "";
      let valB: string = "";

      if (sortBy === "nombres") {
        valA = a.nombres.toLowerCase();
        valB = b.nombres.toLowerCase();
      } else if (sortBy === "apellidoPat") {
        valA = a.apellidoPat.toLowerCase();
        valB = b.apellidoPat.toLowerCase();
      } else if (sortBy === "ci") {
        valA = a.identificacion;
        valB = b.identificacion;
      }

      let comparacion = valA.localeCompare(valB, undefined, { numeric: sortBy === "ci" });

      return sortOrder === "asc" ? comparacion : -comparacion;
    });
  }, [personal, sortBy, sortOrder]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Botones de ordenamiento arriba */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight="medium">
          Ordenar por:
        </Typography>

        <Button
          variant={sortBy === "nombres" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("nombres")}
          onClick={() => toggleSort("nombres")}
          sx={{ textTransform: "none" }}
        >
          Nombres
        </Button>

        <Button
          variant={sortBy === "apellidoPat" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("apellidoPat")}
          onClick={() => toggleSort("apellidoPat")}
          sx={{ textTransform: "none" }}
        >
          Apellido Paterno
        </Button>

        <Button
          variant={sortBy === "ci" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("ci")}
          onClick={() => toggleSort("ci")}
          sx={{ textTransform: "none" }}
        >
          CI
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          Total: {personal.length} persona{personal.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombres</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ap. Paterno</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ap. Materno</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Teléfono</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CI</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personalOrdenado.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay personal registrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              personalOrdenado.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.nombres}</TableCell>
                  <TableCell>{p.apellidoPat}</TableCell>
                  <TableCell>{p.apellidoMat || "-"}</TableCell>
                  <TableCell>{p.telefono}</TableCell>
                  <TableCell>{p.identificacion}</TableCell>
                  <TableCell>{p.correo}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => onView(p)}>
                      Ver
                    </Button>
                    <Button size="small" onClick={() => onEdit(p)} sx={{ ml: 1 }}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleEliminar(p.id)}
                      sx={{ ml: 1 }}
                    >
                      Eliminar
                    </Button>
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