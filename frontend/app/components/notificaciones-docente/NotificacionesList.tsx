"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import NotificacionCard from "./NotificacionCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Asignacion {
  id: number;
  // Puedes agregar más campos cuando los tengas
}

interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  fecha_creacion: string;
  leida: boolean;
  fecha_leida: string | null;
  asignacion?: Asignacion;
}

interface Props {
  docenteId: number;
  onMarcarLeida: () => void;
}

export default function NotificacionesList({ docenteId, onMarcarLeida }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [conteoNoLeidas, setConteoNoLeidas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resNotis, resConteo] = await Promise.all([
        fetch(`${API_BASE}/notificaciones-docentes/docente/${docenteId}`),
        fetch(`${API_BASE}/notificaciones-docentes/no-leidas/${docenteId}`),
      ]);

      if (!resNotis.ok || !resConteo.ok) throw new Error("Error al cargar datos");

      const dataNotis = await resNotis.json();
      const dataConteo = await resConteo.json();

      setNotificaciones(dataNotis);
      setConteoNoLeidas(dataConteo.count);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Opcional: poll cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [docenteId]);

  const marcarComoLeida = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/notificaciones-docentes/${id}/leida`, {
        method: "PATCH",
      });

      if (res.ok) {
        onMarcarLeida(); // Refresca la lista
      }
    } catch (err) {
      // Puedes agregar un toast aquí si usas notistack o similar
      console.error("Error al marcar como leída");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (notificaciones.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 6, textAlign: "center", bgcolor: "#f9f9f9" }}>
        <Typography variant="h6" color="text.secondary">
          No tienes notificaciones pendientes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ¡Todo al día!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {conteoNoLeidas > 0 && (
        <Alert severity="info">
          Tienes {conteoNoLeidas} notificación{conteoNoLeidas > 1 ? "es" : ""} sin leer.
        </Alert>
      )}

      {notificaciones.map((noti) => (
        <NotificacionCard
          key={noti.id}
          notificacion={noti}
          onMarcarLeida={() => marcarComoLeida(noti.id)}
        />
      ))}
    </Box>
  );
}