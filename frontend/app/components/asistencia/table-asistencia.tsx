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