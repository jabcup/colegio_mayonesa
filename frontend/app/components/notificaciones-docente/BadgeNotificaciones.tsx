"use client";

import { useState, useEffect } from "react";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Props {
  docenteId: number;
}

export default function BadgeNotificaciones({ docenteId }: Props) {
  const [count, setCount] = useState(0);
  const router = useRouter();

  const fetchCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/notificaciones-docentes/no-leidas/${docenteId}`, {
        cache: "no-store", // Para que siempre traiga datos frescos
      });

      if (res.ok) {
        const data = await res.json();
        setCount(data.count || 0);
      }
    } catch (err) {
      console.error("Error al cargar conteo de notificaciones");
      // No hacemos nada visible, solo no muestra el número si falla
    }
  };

  useEffect(() => {
    if (!docenteId) return;

    fetchCount();

    // Actualiza cada 30 segundos
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [docenteId]);

  const handleClick = () => {
    router.push("/notificaciones-docente");
  };

  return (
    <Tooltip title="Ver mis notificaciones">
      <IconButton color="inherit" onClick={handleClick} size="large">
        <Badge badgeContent={count} color="error" invisible={count === 0}>
          <Notifications fontSize="medium" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}