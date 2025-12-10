"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, CircularProgress, Typography } from "@mui/material";
import FormEstudiante from "../components/estudiante/form";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import TableEstudiante from "../components/estudiante/table";

interface Estudiante {
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
  relacion?: string; // opcional si no se usa
  estado: string;
  fecha_creacion: string;
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/estudiante/MostrarEstudiantes");
      setEstudiantes(Array.isArray(res.data) ? res.data : []); // Protección
    } catch (err) {
      console.error(err);
      alert("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const crearEstudiante = async (data: unknown) => {
    try {
      const res = await api.post("/estudiante/CrearEstudianteCompleto", data);
      alert("Estudiante creado exitosamente");
      cargarEstudiantes(); // recargar lista
      console.log(res.data);
    } catch (err: unknown) {
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
      ) : estudiantes.length > 0 ? (
        <TableEstudiante estudiantes={estudiantes} />
      ) : (
        <Typography>No hay estudiantes para mostrar</Typography>
      )}
    </>
  );
}
