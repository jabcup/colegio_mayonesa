"use client";

import Navbar from "../components/Navbar/navbar";
import { api } from "../lib/api";
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import MateriasTable from "../components/materias/table";
import MateriasForm from "../components/materias/form";
import { Boton } from "../components/botones/botonNav";

interface Materia {
  id: number;
  nombre: string;
  estado: string;
}

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"activas" | "inactivas">("activas");

  // Cargar materias
  const cargarMaterias = async () => {
    setLoading(true);
    try {
      const res = await api.get("/materias/MostrarMaterias");
      setMaterias(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar materias");
    } finally {
      setLoading(false);
    }
  };

  const cargarInactivas = async () => {
    try {
      const res = await api.get("/materias/mostrarMateriasInactivas");
      setMaterias(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar materias inactivas");
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  // Cambiar tab
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: "activas" | "inactivas"
  ) => {
    setTab(newValue);
    if (newValue === "activas") cargarMaterias();
    else cargarInactivas();
  };

  // Crear materia
  const crearMateria = async (nombre: string) => {
    try {
      await api.post("/materias/CrearMateria", { nombre });
      alert("Materia creada con éxito ✅");
      cargarMaterias();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear materia");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: "100%", mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Materias
        </Typography>

        <Boton
          label="Crear Materia"
          color="success"
          onClick={() => setShowForm(true)}
          className="ml-2"
        />

        {showForm && (
          <MateriasForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onCreate={crearMateria}
          />
        )}

        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 2 }}>
          <Tab label="Activas" value="activas" />
          <Tab label="Inactivas" value="inactivas" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === "activas" && (
            <MateriasTable
              materias={materias}
              tipo="activas"
              onMateriasUpdate={cargarMaterias}
            />
          )}
          {tab === "inactivas" && (
            <MateriasTable
              materias={materias}
              tipo="inactivas"
              onMateriasUpdate={cargarInactivas}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
