"use client";

import Navbar from "../components/Navbar/navbar";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

import TablaTutores, { Tutor } from "../components/tutores/table-tutores";
import FormTutor from "../components/tutores/form-tutor";
import SelectorGestion from "../components/tutores/selector-gestion";
import { Boton } from "../components/botones/botonNav";

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [gestionSeleccionada, setGestionSeleccionada] = useState(0);

  const cargarTutores = async () => {
    const res = await api.get("/tutores/ListarTutores");
    setTutores(res.data.tutores);
  };

  useEffect(() => {
    cargarTutores();
  }, []);
  const crearTutor = async (data: { idPersonal: number; idCurso: number }) => {
    try {
      await api.post("/tutores/CrearTutor", data);
      alert("Tutor asignado correctamente");
      cargarTutores();
    } catch (error: any) {
      alert(
        error.response?.data?.message ?? "Ocurrió un error al asignar el tutor"
      );
    }
  };

  const editarTutor = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsEdit(true);
    setShowForm(true);
  };

  const actualizarTutor = async (data: {
    idPersonal: number;
    idCurso: number;
  }) => {
    if (!selectedTutor) return;

    try {
      await api.put(`/tutores/EditarTutor/${selectedTutor.id}`, data);
      alert("Tutor actualizado correctamente");
      cargarTutores();
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
          "Ocurrió un error al actualizar el tutor"
      );
    }
  };

  const maxGestion = useMemo(() => {
    if (tutores.length === 0) return new Date().getFullYear();
    return Math.max(...tutores.map((t) => t.curso.gestion));
  }, [tutores]);

  const gestiones = useMemo(() => {
    const years: number[] = [];
    for (let y = 2020; y <= maxGestion; y++) {
      years.push(y);
    }
    return years;
  }, [maxGestion]);

  const tutoresFiltrados = useMemo(() => {
    if (gestionSeleccionada === 0) return tutores;
    return tutores.filter((t) => t.curso.gestion === gestionSeleccionada);
  }, [tutores, gestionSeleccionada]);

  const eliminarTutor = async (id: number) => {
    if (!confirm("¿Eliminar tutor?")) return;

    try {
      await api.delete(`/tutores/EliminarTutor/${id}`);
      cargarTutores();
    } catch (error: any) {
      alert(error.response?.data?.message ?? "Error al eliminar tutor");
    }
  };

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" gutterBottom>
        Tutores por Curso
      </Typography>

      <SelectorGestion
        gestion={gestionSeleccionada}
        gestiones={gestiones}
        onChange={setGestionSeleccionada}
      />
      <Boton
        label="Asignar Nuevo Tutor"
        color="success"
        className="ml-2"
        onClick={() => {
          setIsEdit(false);
          setSelectedTutor(null);
          setShowForm(true);
        }}
        size="small"
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 22,
            height: 14,
            backgroundColor: "#FFC107",
            borderRadius: 0.5,
            border: "1px solid #ccc",
          }}
        />
        <Typography variant="body2">
          Tutor asignado al mismo o a dos cursos
        </Typography>
      </Box>

      <TablaTutores
        tutores={tutoresFiltrados}
        onEdit={editarTutor}
        onDelete={eliminarTutor}
      />
      <FormTutor
        open={showForm}
        onClose={() => setShowForm(false)}
        isEdit={isEdit}
        selectedTutor={selectedTutor}
        onCreate={crearTutor}
        onUpdate={actualizarTutor}
      />
    </>
  );
}
