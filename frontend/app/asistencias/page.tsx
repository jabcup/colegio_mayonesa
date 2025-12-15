"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import FormAsistencia from "../components/asistencia/form-asistencia";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import TableAsistencia from "../components/asistencia/table-asistencia";

export default function AsistenciaPage() {
    const [loading, setLoading] = useState(true);
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
                onClick={() => setShowForm(true)}
                sx={{ mb: 2 }}
            >
                Realizar una Asistencia
            </Button>

            <TableAsistencia asistencias={[]} />

            <FormAsistencia
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearAsistencia}
            />
        </>
    );
};