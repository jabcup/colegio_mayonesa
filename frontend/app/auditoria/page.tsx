"use client";

import Navbar from "@/app/components/Navbar/navbar";

import { Button, MenuItem, TextField, Typography } from "@mui/material";

import TablaAuditoria from "../components/auditoria/tabla-auditoria";
import { useState, useEffect } from "react";
import { api } from "../lib/api";

interface Auditoria {
  id: number;
  tabla: string;
  operacion: string;
  idRegistro: number;
  datosAntes: DatosAntes;
  datosDespues: DatosDespues;
  usuarioId: number;
  fecha_registro: string;
}

interface DatosAntes {
  nombre: string;
  gestion: number;
  paralelo: string;
  capacidad: number;
}

interface DatosDespues {
  id: number;
  estado: string;
  nombre: string;
  gestion: number;
  paralelo: string;
  capacidad: number;
  fechaCreacion: string;
}

export default function AuditoriaPage() {
  const [loading, setLoading] = useState(false);

  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  const [operacion, setOperacion] = useState<"POST" | "PUT" | "DELETE" | "">(
    ""
  );

  useEffect(() => {
    const fetchAuditorias = async () => {
      setLoading(true);
      try {
        const params = operacion ? { operacion } : {};
        const res = await api.get("/auditoria", { params });
        setAuditorias(res.data);
      } catch (err) {
        console.error("Error cargando auditoría:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditorias();
  }, [operacion]);

  return (
    <>
      <Navbar />
      <Typography variant="h4">Auditoria</Typography>

      <TextField
        select
        label="Filtrar por Operación"
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        value={operacion}
        onChange={(e) =>
          setOperacion(e.target.value as "POST" | "PUT" | "DELETE" | "")
        }
      >
        <MenuItem value="">Todas</MenuItem>
        <MenuItem value="POST">POST</MenuItem>
        <MenuItem value="PUT">PUT</MenuItem>
        <MenuItem value="DELETE">DELETE</MenuItem>
      </TextField>

      <TablaAuditoria auditorias={auditorias} loading={loading} />
    </>
  );
}
