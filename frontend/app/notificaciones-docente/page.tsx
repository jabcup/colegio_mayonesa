"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import Navbar from "@/app/components/Navbar/navbar";
import NotificacionesList from "../components/notificaciones-docente/NotificacionesList";
import { getCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NotificacionesDocentePage() {
  const [docenteId, setDocenteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Obtenemos el ID del docente desde la cookie (igual que en otros módulos)
    const id = getCookie("usuario_id");
    if (id) {
      setDocenteId(Number(id));
    } else {
      setError("No se encontró el usuario autenticado.");
    }
    setLoading(false);
  }, []);

  const handleMarcarLeida = () => {
    // Forzamos refresh de la lista al marcar una como leída
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  if (error || !docenteId) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Alert severity="error">{error || "Debes iniciar sesión para ver tus notificaciones."}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Mis Notificaciones
        </Typography>

        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Aquí encontrarás todas las notificaciones sobre asignaciones de cursos y avisos importantes.
        </Typography>

        <NotificacionesList
          key={refreshKey}
          docenteId={docenteId}
          onMarcarLeida={handleMarcarLeida}
        />
      </Container>
    </>
  );
}