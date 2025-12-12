"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, Typography } from "@mui/material";
import FormAsistencia from "../components/asistencias/form-asistencia";
import { useState } from "react";
import TableAsistencias from "../components/asistencias/table-asistencias";
import { api } from "../lib/api";
export default function AsistenciasPage() {
    const [showForm, setShowForm] = useState(false);
    const crearAsistencia = async (data: unknown) => {
        try {
            await api.post("/asistencias", data);
            alert("Asistencia creada con éxito");
        } catch (err) {
            console.error(err);
            alert("Error al crear la asistencia");
        }
    };

    return (
        <>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom>
                Página de Asistencias
            </Typography>
            <Button
                variant="contained"
                onClick={() => setShowForm(true)}>Mostrar Formulario de Asistencia</Button>
            <TableAsistencias asistencias={[]} />
            <FormAsistencia
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearAsistencia}
            />
        </>
    );
}