"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

interface AsistenciaFiltrada {
  id: number;
  asistencia: string;
  fecha: string;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
}

interface AsistenciaBackend {
  asistencia_id: number;
  asistencia_asistencia: string;
  fecha: string;
  estudiante_id: number;
  estudiante_nombres: string;
  estudiante_apellidoPat: string;
  estudiante_apellidoMat: string;
  materia_id: number;
  materia_nombre: string;
}

interface BatchAsistencia {
  estudiante: Estudiante;
  asistencia: string;
}

interface Props {
  asistencias: AsistenciaFiltrada[];
}

export interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

export interface MateriaDocente {
  idMateria: number;
  nombre: string;
}

export interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

interface BackAsignacionClase {
  id: number;
  nombre: string;
  paralelo: string;
}

interface BackMateriaDocente {
  id: number;
  nombre: string;
}

interface BackEstudianteCurso {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
}

export default function TableAsistencia({ asistencias }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<MateriaDocente[]>([]);
  const [estudiantesCurso, setEstudiantesCurso] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [calificacionesFiltradas, setCalificacionesFiltradas] = useState<AsistenciaFiltrada[]>(
    [],
  );

  const [mode, setMode] = useState<'none' | 'add' | 'view'>('none');
  const [batchAsistencias, setBatchAsistencias] = useState<BatchAsistencia[]>([]);
  const [filtro, setFiltro] = useState({
    idCurso: '',
    idMateria: '',
    idEstudiante: '',
    fromDate: '',
    toDate: '',
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const idDocente = 1;
      const cursosRes = await api.get(
        `/asignacion-clases/por-docente/${idDocente}`,
      );
      const cursosMap = (cursosRes.data as BackAsignacionClase[]).map((a) => ({
        idCurso: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
      }));

      setCursosDocente(cursosMap);
    } catch (err) {
      console.error(err);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCursoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idCurso = e.target.value;
    setFiltro({ ...filtro, idCurso, idMateria: '', idEstudiante: '' });
    setMateriasCurso([]);
    setEstudiantesCurso([]);
    setBatchAsistencias([]);

    const idDocente = 1;

    setLoading(true);
    try {
      const estudiantesRes = await api.get(`/estudiante-curso/${idCurso}`);
      const estudiantesMap = (estudiantesRes.data as BackEstudianteCurso[]).map(
        (ec) => ({
          id: ec.estudiante.id,
          nombres: ec.estudiante.nombres,
          apellidoPat: ec.estudiante.apellidoPat,
          apellidoMat: ec.estudiante.apellidoMat,
        }),
      );

      setEstudiantesCurso(estudiantesMap);

      const materiaRes = await api.get(
        `/asignacion-clases/materias-por-docente-curso/${idDocente}/${Number(
          idCurso,
        )}`,
      );
      const materiasMap = (materiaRes.data as BackMateriaDocente[]).map((m) => ({
        idMateria: m.id,
        nombre: m.nombre,
      }));
      setMateriasCurso(materiasMap);
    } catch (err) {
      console.error(err);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleMateriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idMateria = e.target.value;
    setFiltro({ ...filtro, idMateria, idEstudiante: '' });
    setBatchAsistencias([]);
  };

  const handleEstudianteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idEstudiante = e.target.value;
    setFiltro({ ...filtro, idEstudiante });
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({ ...filtro, fromDate: e.target.value });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({ ...filtro, toDate: e.target.value });
  };

  const handleLoadBatch = async () => {
    if (!filtro.idCurso || !filtro.idMateria) return;

    setLoading(true);
    try {
      const batch: BatchAsistencia[] = estudiantesCurso.map((e) => ({
        estudiante: e,
        asistencia: 'presente',
      }));
      setBatchAsistencias(batch);
    } catch (err) {
      console.error(err);
      alert('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleAsistenciaChange = (idEstudiante: number, newAsistencia: string) => {
    const updated = batchAsistencias.map((b) =>
      b.estudiante.id === idEstudiante ? { ...b, asistencia: newAsistencia } : b,
    );
    setBatchAsistencias(updated);
  };

  const handleFinalizar = async () => {
    if (batchAsistencias.length === 0) return;

    setLoading(true);
    try {
      const payload = batchAsistencias.map((b) => ({
        idAsignacion: Number(filtro.idMateria),
        idEstudiante: b.estudiante.id,
        asistencia: b.asistencia,
      }));
      await api.post('/asistencias/batch', payload);
      alert('Asistencias registradas con éxito');
      setBatchAsistencias([]);
      setMode('none');
      setFiltro({
        idCurso: '',
        idMateria: '',
        idEstudiante: '',
        fromDate: '',
        toDate: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error al registrar asistencias');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarView = async () => {
    if (!filtro.idCurso || !filtro.idMateria || !filtro.idEstudiante || !filtro.fromDate || !filtro.toDate) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/asistencias/BuscarAsistenciasPorCursoYMateria/${Number(
          filtro.idCurso,
        )}/${Number(filtro.idMateria)}?estudianteId=${Number(
          filtro.idEstudiante,
        )}&fromDate=${filtro.fromDate}&toDate=${filtro.toDate}`,
      );

      const asistenciasMap: AsistenciaFiltrada[] = (
        res.data.asistencias || []
      ).map((c: AsistenciaBackend) => ({
        id: c.asistencia_id,
        asistencia: c.asistencia_asistencia,
        fecha: c.fecha,
        estudiante: {
          id: c.estudiante_id,
          nombres: c.estudiante_nombres,
          apellidoPat: c.estudiante_apellidoPat,
          apellidoMat: c.estudiante_apellidoMat,
        },
        materia: {
          id: c.materia_id,
          nombre: c.materia_nombre,
        },
      }));
      setCalificacionesFiltradas(asistenciasMap);
    } catch (err) {
      console.error(err);
      alert('Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setMode('add')}
        sx={{ mr: 2, mb: 2 }}
      >
        Agregar Asistencia
      </Button>
      <Button
        variant="contained"
        onClick={() => setMode('view')}
        sx={{ mb: 2 }}
      >
        Ver Asistencias
      </Button>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}

      {mode !== 'none' && (
        <>
          <TextField
            select
            label="Curso"
            value={filtro.idCurso}
            onChange={handleCursoChange}
            sx={{ mr: 2, mb: 2, minWidth: 200 }}
          >
            {cursosDocente.map((c) => (
              <MenuItem key={c.idCurso} value={c.idCurso.toString()}>
                {c.nombre} - {c.paralelo}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Materia"
            value={filtro.idMateria}
            onChange={handleMateriaChange}
            sx={{ mr: 2, mb: 2, minWidth: 200 }}
            disabled={!filtro.idCurso}
          >
            {materiasCurso.map((m) => (
              <MenuItem key={m.idMateria} value={m.idMateria.toString()}>
                {m.nombre}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}

      {mode === 'add' && filtro.idMateria && (
        <>
          <Button
            variant="contained"
            onClick={handleLoadBatch}
            sx={{ mb: 2 }}
          >
            Agregar Asistencias
          </Button>

          {batchAsistencias.length > 0 && (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Estudiante</TableCell>
                      <TableCell>Asistencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batchAsistencias.map((b) => (
                      <TableRow key={b.estudiante.id}>
                        <TableCell>
                          {b.estudiante.nombres} {b.estudiante.apellidoPat}{' '}
                          {b.estudiante.apellidoMat}
                        </TableCell>
                        <TableCell>
                          <TextField
                            select
                            value={b.asistencia}
                            onChange={(e) =>
                              handleAsistenciaChange(b.estudiante.id, e.target.value)
                            }
                          >
                            <MenuItem value="presente">Presente</MenuItem>
                            <MenuItem value="falta">Falta</MenuItem>
                            <MenuItem value="ausente">Ausente</MenuItem>
                            <MenuItem value="justificativo">Justificativo</MenuItem>
                          </TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                onClick={handleFinalizar}
                sx={{ mt: 2 }}
              >
                Finalizar Asistencias
              </Button>
            </>
          )}
        </>
      )}

      {mode === 'view' && filtro.idMateria && (
        <>
          <TextField
            select
            label="Estudiante"
            value={filtro.idEstudiante}
            onChange={handleEstudianteChange}
            sx={{ mr: 2, mb: 2, minWidth: 200 }}
            disabled={!filtro.idCurso}
          >
            {estudiantesCurso.map((e) => (
              <MenuItem key={e.id} value={e.id.toString()}>
                {e.nombres} {e.apellidoPat} {e.apellidoMat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Desde"
            type="date"
            value={filtro.fromDate}
            onChange={handleFromDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mr: 2, mb: 2 }}
          />

          <TextField
            label="Hasta"
            type="date"
            value={filtro.toDate}
            onChange={handleToDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mr: 2, mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleBuscarView}
            sx={{ mb: 2 }}
          >
            Buscar
          </Button>

          {calificacionesFiltradas.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Estudiante</TableCell>
                    <TableCell>Asistencia</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calificacionesFiltradas.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        {c.estudiante.nombres} {c.estudiante.apellidoPat}{' '}
                        {c.estudiante.apellidoMat}
                      </TableCell>
                      <TableCell>{c.asistencia}</TableCell>
                      <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </>
  );
}