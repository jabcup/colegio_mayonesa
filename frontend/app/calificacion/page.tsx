"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import FormCalificacion from "../components/calificacion/form-calificacion";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import TableCalificacion from "../components/calificacion/table-calificacion";

export default function CalificacionPage() {
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const crearCalificacion = async (data: unknown) => {
        try {
            await api.post("/calificaciones", data);
            alert("Calificación creada con éxito");
        } catch (err) {
            console.error(err);
            alert("Error al crear la calificación");
        }
    };

    return (
        <>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom>
                Página de Calificaciones
            </Typography>

            <Button
                variant="contained"
                onClick={() => setShowForm(true)}
                sx={{ mb: 2 }}
            >
                Realizar una Calificación
            </Button>

            <TableCalificacion calificaciones={[]} />

            <FormCalificacion
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearCalificacion}
            />
        </>
    );
}