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

interface Materia {
  id: number;
  nombre: string;
  estado: string;
}

interface Props {
  materias: Materia[];
  tipo: "activas" | "inactivas";
  onMateriasUpdate?: () => void;
}

export default function MateriasTable({ materias, tipo, onMateriasUpdate }: Props) {

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta materia?")) return;

    try {
      await api.delete(`/materias/EliminarMateria/${id}`);
      alert("Materia eliminada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al eliminar materia");
    }
  };

  const handleEditar = async (id: number) => {
    const nuevoNombre = prompt("Ingrese el nuevo nombre de la materia");
    if (!nuevoNombre) return;

    try {
      await api.put(`/materias/EditarMateria/${id}`, { nombre: nuevoNombre });
      alert("Materia actualizada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al actualizar materia");
    }
  };

  const handleReactivar = async (id: number) => {
    try {
      await api.put(`/materias/reactivarMateria/${id}`);
      alert("Materia reactivada exitosamente");
      onMateriasUpdate?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al reactivar materia");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materias.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.id}</TableCell>
              <TableCell>{m.nombre}</TableCell>
              <TableCell>
                {tipo === "activas" ? (
                  <>
                    <Boton label="Editar" color="primary" size="small" onClick={() => handleEditar(m.id)} />
                    <Boton label="Eliminar" color="error" size="small" className="ml-2" onClick={() => handleEliminar(m.id)} />
                  </>
                ) : (
                  <Boton label="Reactivar" color="success" size="small" onClick={() => handleReactivar(m.id)} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
