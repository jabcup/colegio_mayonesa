"use client";

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Boton } from "../botones/botonNav";
import { api } from "@/app/lib/api";

interface Horario {
  id: number;
  horario: string;
  estado: string;
}

interface Props {
  horarios: Horario[];
  tipo: "activas" | "inactivas";
  onHorariosUpdate?: () => void;
}

export default function HorariosTable({ horarios, tipo, onHorariosUpdate }: Props) {

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este horario?")) return;

    try {
      await api.delete(`/horarios/EliminarHorario/${id}`);
      alert("Horario eliminado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al eliminar horario");
    }
  };

  const handleEditar = async (id: number) => {
    const nuevoHorario = prompt("Ingrese el nuevo lapso de tiempo");
    if (!nuevoHorario) return;

    try {
      await api.put(`/horarios/EditarHorario/${id}`, { horario: nuevoHorario });
      alert("Horario actualizado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al actualizar horario");
    }
  };

  const handleReactivar = async (id: number) => {
    try {
      await api.put(`/horarios/reactivarHorario/${id}`);
      alert("Horario reactivado exitosamente");
      onHorariosUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al reactivar horario");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell>ID</TableCell> */}
            <TableCell>Horario</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {horarios.map((h) => (
            <TableRow key={h.id}>
              {/* <TableCell>{h.id}</TableCell> */}
              <TableCell>{h.horario}</TableCell>
              <TableCell>
                {tipo === "activas" ? (
                  <>
                    <Boton label="Editar" color="primary" size="small" onClick={() => handleEditar(h.id)} />
                    <Boton label="Eliminar" color="error" size="small" className="ml-2" onClick={() => handleEliminar(h.id)} />
                  </>
                ) : (
                  <Boton label="Reactivar" color="success" size="small" onClick={() => handleReactivar(h.id)} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
