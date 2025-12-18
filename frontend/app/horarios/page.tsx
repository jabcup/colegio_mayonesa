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
import HorariosTable from "../components/horarios/table";
import HorariosForm from "../components/horarios/form";

interface Horario {
  id: number;
  horario: string;
  estado: string;
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"activas" | "inactivas">("activas");

  // Cargar materias
  const cargarHorarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/horarios/MostrarHorarios");
      setHorarios(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar horarios");
    } finally {
      setLoading(false);
    }
  };

  const cargarInactivas = async () => {
    try {
      const res = await api.get("/horarios/mostrarHorariosInactivas");
      setHorarios(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar horarios inactivos");
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  // Cambiar tab
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: "activas" | "inactivas"
  ) => {
    setTab(newValue);
    if (newValue === "activas") cargarHorarios();
    else cargarInactivas();
  };

  // Crear materia
  const crearHorario = async (horario: string) => {
    try {
      await api.post("/horarios/CrearHorario", { horario });
      alert("Horario creado con éxito ✅");
      cargarHorarios();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear horario");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: "100%", mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Horarios
        </Typography>

        <Boton
          label="Crear Horario"
          color="success"
          onClick={() => setShowForm(true)}
          className="ml-2"
        />

        {showForm && (
          <HorariosForm
            open={showForm}
            onClose={() => setShowForm(false)}
            onCreate={crearHorario}
          />
        )}

        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 2 }}>
          <Tab label="Activas" value="activas" />
          <Tab label="Inactivas" value="inactivas" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === "activas" && (
            <HorariosTable
              horarios={horarios}
              tipo="activas"
              onHorariosUpdate={cargarHorarios}
            />
          )}
          {tab === "inactivas" && (
            <HorariosTable
              horarios={horarios}
              tipo="inactivas"
              onHorariosUpdate={cargarInactivas}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
