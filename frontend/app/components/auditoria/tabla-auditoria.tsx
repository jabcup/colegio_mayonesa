import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";
import { api } from "@/app/lib/api";

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

interface Props {
  auditorias: Auditoria[];
  loading: boolean;
}

export default function TablaAuditoria({ auditorias, loading }: Props) {
  if (loading) return <CircularProgress />;

  if (auditorias.length === 0)
    return <Typography>No hay registros de auditoría.</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tabla</TableCell>
            <TableCell>Operación</TableCell>
            <TableCell>ID Registro</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Datos Antes</TableCell>
            <TableCell>Datos Después</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditorias.map((aud) => (
            <TableRow key={aud.id}>
              <TableCell>{aud.id}</TableCell>
              <TableCell>{aud.tabla}</TableCell>
              <TableCell>{aud.operacion}</TableCell>
              <TableCell>{aud.idRegistro ?? '-'}</TableCell>
              <TableCell>{aud.usuarioId}</TableCell>
              <TableCell>{new Date(aud.fecha_registro).toLocaleString()}</TableCell>
              <TableCell>
                <pre>{aud.datosAntes ? JSON.stringify(aud.datosAntes, null, 2) : '-'}</pre>
              </TableCell>
              <TableCell>
                <pre>{aud.datosDespues ? JSON.stringify(aud.datosDespues, null, 2) : '-'}</pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
