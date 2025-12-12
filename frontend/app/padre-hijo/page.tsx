"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

import Navbar from "../components/Navbar/navbar";
export interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion: string;
  correo_institucional: string;
}
export default function PadreHijosPage() {
  const [estudiante, setEstudiante] = useState<Estudiante>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = 1; // luego cambiar por el de local storage
        const res = await api.get(`/estudiante/MostrarEstudiante/${id}`);
        setEstudiante(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log(estudiante);
  });
  return (
    <>
      <Navbar />

      <Typography variant="h3" sx={{ mb: 2 }}>
        Hijo
      </Typography>
      {!estudiante ? (
        <p>Estudiante no encontrado</p>
      ) : (
        <p>
          {estudiante.nombres} {estudiante.apellidoPat} {estudiante.apellidoMat}{" "}
          {estudiante.identificacion} {estudiante.correo_institucional}
        </p>
      )}
    </>
  );
}
