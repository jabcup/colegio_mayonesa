"use client";

import Navbar from "../components/Navbar/navbar";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getAuthData } from "../lib/auth";
import FormCurso from "../components/cursos/form-curso";
import TablaCurso from "../components/cursos/tabla-curso";
import { Boton } from "../components/botones/botonNav";
import { useRouter } from "next/navigation";

// Interfaz que viene del backend
interface BackCurso {
  id: number;
  nombre: string;
  paralelo: {
    id: number;
    nombre: string;
  };
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface Curso extends BackCurso {}

export default function PaginaCursos() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  const { rol } = getAuthData();

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos/CursosActivos");
      // El backend ya trae paralelo como objeto gracias a relations: ['paralelo']
      setCursos(res.data as Curso[]);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  // Crear curso → envía idParalelo
  const crearCurso = async (data: {
    nombre: string;
    idParalelo: number;
    gestion: number;
    capacidad: number;
  }) => {
    try {
      await api.post("/cursos/CrearCurso", data);
      alert("Curso creado con éxito");
      setShowForm(false);
      cargarCursos();
    } catch (err) {
      console.error(err);
      alert("Error al crear el curso");
    }
  };

  // Actualizar curso
  const actualizarCurso = async (data: {
    nombre: string;
    idParalelo: number;
    gestion: number;
    capacidad: number;
  }) => {
    if (!selectedCurso) return;

    try {
      await api.put(`/cursos/EditarCurso/${selectedCurso.id}`, data);
      alert("Curso actualizado con éxito");
      setShowForm(false);
      setSelectedCurso(null);
      cargarCursos();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el curso");
    }
  };

  const eliminarCurso = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
      await api.delete(`/cursos/EliminarCurso/${id}`);
      alert("Curso eliminado");
      cargarCursos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const editarCurso = (curso: Curso) => {
    setSelectedCurso(curso);
    setShowForm(true);
  };

  const cerrarForm = () => {
    setShowForm(false);
    setSelectedCurso(null);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <Typography variant="h4" align="center" gutterBottom>
          Gestión de Cursos
        </Typography>

        <div className="flex gap-4 my-6 justify-center">
          <Boton
            label="Crear Curso"
            color="success"
            onClick={() => setShowForm(true)}
            size="medium"
          />
          <Boton
            label="Ver Paralelos"
            color="primary"
            onClick={() => router.push("/paralelos")}
            size="medium"
          />
        </div>

        {/* Formulario modal */}
        <FormCurso
          open={showForm}
          onClose={cerrarForm}
          onCreate={crearCurso}
          onUpdate={actualizarCurso}
          selectedCurso={selectedCurso}
        />

        {/* Tabla de cursos */}
        {loading ? (
          <Typography align="center">Cargando cursos...</Typography>
        ) : (
          <TablaCurso
            cursos={cursos}
            onEdit={editarCurso}
            onDelete={eliminarCurso}
          />
        )}
      </div>
    </>
  );
}
