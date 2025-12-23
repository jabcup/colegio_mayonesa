// components/table-asistencia.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface Asistencia {
  id: number;
  asistencia: 'presente' | 'falta' | 'ausente' | 'justificativo';
  fecha_creacion: string;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  asignacionClase: { id: number };
}

export default function AsistenciaTable() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const fetchAsistencias = async () => {
    try {
      const res = await axios.get('/api/asistencias');
      setAsistencias(res.data);
    } catch (error) {
      console.error('Error cargando asistencias', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta asistencia?')) return;
    try {
      await axios.delete(`/api/asistencias/${id}`);
      fetchAsistencias();
    } catch (error) {
      alert('Error al eliminar');
    }
  };
  const cargarBatch = () => {
    if (!filtro.idCurso || !filtro.idAsignacion) {
      toast.warning("Selecciona curso y materia");
      return;
    }
    const nuevoBatch = estudiantes.map((e) => ({
      estudiante: e,
      asistencia: "presente",
      idAsignacion: Number(filtro.idAsignacion),
    }));
    setBatch(nuevoBatch);
  };

  const handleAsistenciaChange = (id: number, value: string) => {
    setBatch(
      batch.map((b) =>
        b.estudiante.id === id ? { ...b, asistencia: value } : b
      )
    );
  };

  const refrescarDatosCurso = async () => {
  if (!filtro.idCurso) return;

  const idDocente = Number(Cookies.get("personal_id") ?? 4);
  setLoading(true);

  try {
    const estRes = await api.get(
      `/estudiante-curso/estudiantes-por-curso/${filtro.idCurso}`
    );
    setEstudiantes(estRes.data.map((ec: any) => ec.estudiante));

    const matRes = await api.get(
      `/asignacion-clases/materias-por-docente-curso-asignacion/${idDocente}/${filtro.idCurso}`
    );
    setMaterias(
      matRes.data.map((m: any) => ({
        idAsignacion: m.idAsignacion,
        idMateria: m.idMateria,
        nombre: m.nombre,
      }))
    );
  } catch {
    toast.error("Error al refrescar datos");
  } finally {
    setLoading(false);
  }
};

  //---------------Descomentar para registrar asistencias en calidad------------------------------

// const registrarBatch = async () => {
//   if (batch.length === 0) return;

//   const payload = batch.map((b) => ({
//     idAsignacion: b.idAsignacion,
//     idEstudiante: b.estudiante.id,
//     asistencia: b.asistencia,
//   }));

//   try {
//     await api.post("/asistencias/batch", payload);

//     toast.success("Asistencias registradas con éxito");

//     setBatch([]);

//     // 🔥 RECARGA REAL
//     await refrescarDatosCurso();

//     // 🔁 Vuelve a cargar la lista
//     cargarBatch();
//   } catch {
//     toast.error("Error al registrar asistencias");
//   }
// };


  //---------------Comentar para registrar asistencias en calidad------------------------------
  const registrarBatch = async () => {
  const hoy = new Date();
  const diaSemana = hoy.getDay();

  if (diaSemana === 0 || diaSemana === 6) {
    toast.error(
      "No se puede registrar asistencia en sábado ni domingo"
    );
    return;
  }

  if (batch.length === 0) {
    toast.error("No hay asistencias para registrar");
    return;
  }

  const payload = batch.map((b) => ({
    idAsignacion: b.idAsignacion,
    idEstudiante: b.estudiante.id,
    asistencia: b.asistencia,
  }));

  try {
    await api.post("/asistencias/batch", payload);
    toast.success("Asistencias registradas con éxito");

    setBatch([]);
    await refrescarDatosCurso();

    cargarBatch();
  } catch (error) {
    toast.error("Error al registrar asistencias");
  }
};


  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'presente': return 'default';
      case 'falta': return 'destructive';
      case 'ausente': return 'secondary';
      case 'justificativo': return 'outline';
      default: return 'default';
    }
  };

  if (loading) return <p>Cargando...</p>;

  const nombreCompleto = (e?: Estudiante | null): string => {
    if (!e) {
      return "Estudiante no encontrado";
    }
    const nombres = e.nombres?.trim() || "";
    const apellidoPat = e.apellidoPat?.trim() || "";
    const apellidoMat = e.apellidoMat?.trim() || "";

    const nombreFull = `${nombres} ${apellidoPat} ${apellidoMat}`.trim();

    return nombreFull || "Sin nombre";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Estudiante</TableHead>
            <TableHead>Asistencia</TableHead>
            <TableHead>Clase ID</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No hay asistencias registradas
              </TableCell>
            </TableRow>
          ) : (
            asistencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{new Date(a.fecha_creacion).toLocaleDateString('es-ES')}</TableCell>
                <TableCell>
                  {a.estudiante.nombres} {a.estudiante.apellidoPat} {a.estudiante.apellidoMat}
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(a.asistencia)}>
                    {a.asistencia.charAt(0).toUpperCase() + a.asistencia.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{a.asignacionClase.id}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}