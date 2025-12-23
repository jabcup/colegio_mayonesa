"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
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

export interface Tutor {
  id: number;
  personal: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  curso: {
    id: number;
    nombre: string;
    paralelo: {
      id: number;
      nombre: string;
    };
    gestion: number;
  };
}

interface Props {
  tutores: Tutor[];
  onEdit: (tutor: Tutor) => void;
  onDelete: (id: number) => void;
}

export default function TablaTutores({ tutores, onEdit, onDelete }: Props) {
  // Estado de ordenamiento
  const [sortBy, setSortBy] = useState<"curso" | "paralelo" | "docente">("curso");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Detección de conflictos (mismo docente en varios cursos de la misma gestión)
  const conflictos: Record<string, number> = {};

  tutores.forEach((t) => {
    const key = `${t.personal.id}-${t.curso.gestion}`;
    conflictos[key] = (conflictos[key] || 0) + 1;
  });

  const esConflicto = (tutor: Tutor) => {
    const key = `${tutor.personal.id}-${tutor.curso.gestion}`;
    return conflictos[key] > 1;
  };

  // Ordenamiento con useMemo
  const tutoresOrdenados = useMemo(() => {
    return [...tutores].sort((a, b) => {
      let valA: string = "";
      let valB: string = "";

      switch (sortBy) {
        case "curso":
          valA = a.curso.nombre.toLowerCase();
          valB = b.curso.nombre.toLowerCase();
          break;
        case "paralelo":
          valA = a.curso.paralelo.nombre.toLowerCase();
          valB = b.curso.paralelo.nombre.toLowerCase();
          break;
        case "docente":
          valA = a.personal.apellidoPat.toLowerCase();
          valB = b.personal.apellidoPat.toLowerCase();
          if (valA === valB) {
            valA = a.personal.nombres.toLowerCase();
            valB = b.personal.nombres.toLowerCase();
          }
          break;
      }

      const comparacion = valA.localeCompare(valB);
      return sortOrder === "asc" ? comparacion : -comparacion;
    });
  }, [tutores, sortBy, sortOrder]);

  // Alternar orden
  const toggleSort = (field: "curso" | "paralelo" | "docente") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Ícono de orden
  const getSortIcon = (field: "curso" | "paralelo" | "docente") => {
    if (sortBy !== field) return <SortIcon fontSize="small" sx={{ opacity: 0.5 }} />;
    return sortOrder === "asc" ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Botones de ordenamiento arriba de la tabla */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight="medium">
          Ordenar por:
        </Typography>

        <Button
          variant={sortBy === "curso" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("curso")}
          onClick={() => toggleSort("curso")}
          sx={{ textTransform: "none" }}
        >
          Curso
        </Button>

        <Button
          variant={sortBy === "paralelo" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("paralelo")}
          onClick={() => toggleSort("paralelo")}
          sx={{ textTransform: "none" }}
        >
          Paralelo
        </Button>

        <Button
          variant={sortBy === "docente" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("docente")}
          onClick={() => toggleSort("docente")}
          sx={{ textTransform: "none" }}
        >
          Docente
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          Total: {tutores.length} asignación{tutores.length !== 1 ? "es" : ""}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Gestión</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Curso</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Paralelo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Docente</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tutoresOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay tutores asignados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tutoresOrdenados.map((t) => {
                const conflicto = esConflicto(t);

                return (
                  <TableRow
                    key={t.id}
                    hover
                    sx={{
                      backgroundColor: conflicto ? "#fdecea" : "inherit",
                    }}
                  >
                    <TableCell>{t.curso.gestion}</TableCell>
                    <TableCell>{t.curso.nombre}</TableCell>
                    <TableCell>{t.curso.paralelo.nombre}</TableCell>
                    <TableCell>
                      {`${t.personal.nombres} ${t.personal.apellidoPat} ${t.personal.apellidoMat || ""}`.trim()}
                    </TableCell>
                    <TableCell>
                      <Boton
                        label="Editar"
                        color="warning"
                        onClick={() => onEdit(t)}
                        size="small"
                      />
                      <Boton
                        label="Eliminar"
                        color="error"
                        size="small"
                        onClick={() => onDelete(t.id)}
                        className="ml-2"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}