"use client";

import Navbar from "../components/Navbar/navbar";

import { Button, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getAuthData } from "../lib/auth";

import FormCurso from "../components/cursos/form-curso";
import TablaCurso from "../components/cursos/tabla-curso";
import { Boton } from "../components/botones/botonNav";

interface Curso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface BackCurso {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

export interface UpdateCursoDto {
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
}

export default function Rol() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cursos, setCursos] = useState<Curso[]>([]);

  const { rol } = getAuthData();

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const Cursosres = await api.get("/cursos/CursosActivos");

      const CursosMap = (Cursosres.data as BackCurso[]).map((c) => ({
        id: c.id,
        nombre: c.nombre,
        paralelo: c.paralelo,
        gestion: c.gestion,
        capacidad: c.capacidad,
        fechaCreacion: c.fechaCreacion,
        estado: c.estado,
      }));

      setCursos(CursosMap);
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

  // Función para agregar un nuevo rol
  const crearCurso = async (data: unknown) => {
    try {
      await api.post("/cursos/CrearCurso", data);
      alert("Curso creado con éxito");
      cargarCursos();
    } catch (err) {
      console.error(err);
      alert("Error al crear el curso");
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

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  const editarCurso = (curso: Curso) => {
    setSelectedCurso(curso);
    setShowForm(true);
  };

  const actualizarCurso = async (data: UpdateCursoDto) => {
    if (!selectedCurso) return;

    try {
      await api.put(`/cursos/EditarCurso/${selectedCurso?.id}`, data);
      alert("Curso actualizado con éxito");

      setShowForm(false);
      setSelectedCurso(null);
      cargarCursos();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el curso");
    }
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Pagina de Cursos
      </Typography>
      <Boton
        label="Crear Curso"
        color="success"
        onClick={() => setShowForm(true)}
        className="ml-2"
        size="small"
      />
        
      <FormCurso
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={crearCurso}
        onUpdate={actualizarCurso}
        selectedCurso={selectedCurso}
      />
      <TablaCurso
        cursos={cursos}
        onEdit={editarCurso}
        onDelete={eliminarCurso}
      />
    </>
  );
}
