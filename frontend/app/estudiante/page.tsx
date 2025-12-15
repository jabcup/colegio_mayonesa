"use client";

import Navbar from "@/app/components/Navbar/navbar";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import FormEstudiante from "../components/estudiante/form";
import TableEstudiante from "../components/estudiante/table";
import { getAuthData } from "../lib/auth";



interface EstudianteFull {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    identificacion: string;
    correo: string;
    correo_institucional: string;
    rude: string;
    direccion: string;
    telefono_referencia: string;
    fecha_nacimiento: string;
    sexo: string;
    nacionalidad: string;
    fecha_creacion: string;
    estado: string;
  };
  tutor: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    telefono: string;
    estado: string;
  };
  relacion: string;
  fecha_creacion: string;
  estado: string;
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<EstudianteFull[]>([]);
  const [filtered, setFiltered] = useState<EstudianteFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { rol, idPersonal} = getAuthData();

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      estudiantes.filter((e) => {
        const fullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat}`.toLowerCase();
        return (
          fullName.includes(s) ||
          e.estudiante.identificacion.includes(s) ||
          e.estudiante.correo.toLowerCase().includes(s)
        );
      })
    );
  }, [search, estudiantes]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/padre-estudiante/todos");
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const crearEstudiante = async (data: any) => {
    try {
      await api.post("/estudiante/CrearEstudianteCompleto", data);
      alert("Estudiante creado exitosamente");
      setShowForm(false);
      cargarEstudiantes();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al crear estudiante");
    }
  };

  return (
    <>
      <Navbar />

      <Typography variant="h4" sx={{ mb: 2 }}>
        Estudiantes
      </Typography>

      <TextField
        label="Buscar por nombre, CI o correo"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setShowForm(true)}>
        Registrar Estudiante
      </Button>

      <FormEstudiante
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={crearEstudiante}
      />

      {loading ? (
        <CircularProgress />
      ) : filtered.length ? (
        <TableEstudiante estudiantes={filtered} />
      ) : (
        <Typography>No hay estudiantes registrados</Typography>
      )}
    </>
  );
}
