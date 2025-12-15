"use client";

import Navbar from "@/app/components/Navbar/navbar";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import FormEstudiante from "../components/estudiante/form";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
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
    fecha_creacion?: string;
    estado?: string;
  };
  relacion: string;
  fecha_creacion?: string;
  estado?: string;
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

    const filteredList = estudiantes.filter((e) => {
      const fullName =
        `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat}`.toLowerCase();
      return (
        fullName.includes(s) ||
        e.estudiante.identificacion.toLowerCase().includes(s) ||
        e.estudiante.correo.toLowerCase().includes(s)
      );
    });

    setFiltered(filteredList);
  }, [search, estudiantes]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/padre-estudiante/todos");
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const crearEstudiante = async (data: unknown) => {
    try {
      await api.post("/estudiante/CrearEstudianteCompleto", data);
      alert("Estudiante creado exitosamente");
      cargarEstudiantes();
    } catch (err) {
      console.error(err);
      alert("Error al crear el estudiante");
    }
  };

  return (
    <>
      <Navbar />

      <Typography variant="h3" sx={{ mb: 2 }}>
        Estudiantes
      </Typography>

      <TextField
        label="Buscar estudiante (nombre, CI o correo)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={() => setShowForm(true)}
        sx={{ mb: 2 }}
      >
        Crear Nuevo Estudiante
      </Button>

      <FormEstudiante
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={crearEstudiante}
      />

      {loading ? (
        <CircularProgress />
      ) : filtered.length > 0 ? (
        <TableEstudiante estudiantes={filtered} />
      ) : (
        <Typography>No hay estudiantes para mostrar</Typography>
      )}
    </>
  );
}
