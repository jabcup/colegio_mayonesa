"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, Typography } from "@mui/material";
import TableAsistencia from "../components/asistencia/table-asistencia";

export default function AsistenciaPage() {
    return (
        <>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom>
                Página de Asistencias
            </Typography>

            <TableAsistencia asistencias={[]} />
        </>
    );
};