"use client";

import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Cursos {
  id: number;
  nombre: string;
  paralelo: string;
  gestion: number;
  capacidad: number;
  fechaCreacion: string;
  estado: string;
}

interface Estudiantes{
  id: number
  nombres: string
  apellidoPat: string
  apellidoMat: string
  identificacion: string
  correo: string
  correo_institucional: string
  rude: string
  direccion: string
  telefono_referencia: string
  fecha_nacimiento: string
  sexo: string
  nacionalidad: string
  fecha_creacion: string
  estado: string
}

interface Props {
  open: boolean;
  onClose: () => void;
  tipoReporte:
    | "calificacionesCurso"
    | "calificacionesEstudiante"
    | "asistenciasCurso"
    | "asistenciasEstudiante"
    | "pagosCurso"
    | "pagosEstudiante"
    | "listadoEstudiantes"
    | "tutoresCurso";
}

export default function FormFiltrosReporte({
  open,
  onClose,
  tipoReporte,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState<Cursos[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiantes[]>([]);

  const [form, setForm] = useState({
    curso: 0,
    estudiante: 0,
    paralelo: "",
    mes: 0,
    anio: 0,
    estado: "",
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      cargarEstudiantes();
    }
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const cursosRes = await api.get(`/cursos/CursosActivos`);

      const cursosMap = (cursosRes.data as Cursos[]).map((a) => ({
        id: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
        gestion: a.gestion,
        capacidad: a.capacidad,
        fechaCreacion: a.fechaCreacion,
        estado: a.estado,
      }));

      setCursos(cursosMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const estudiantesRes = await api.get(`/estudiante/MostrarEstudiantes`);

      const estudiantesMap = (estudiantesRes.data as Estudiantes[]).map((a) => ({
        id: a.id,
        nombres: a.nombres,
        apellidoPat: a.apellidoPat,
        apellidoMat: a.apellidoMat,
        identificacion: a.identificacion,
        correo: a.correo,
        correo_institucional: a.correo_institucional,
        rude: a.rude,
        direccion: a.direccion,
        telefono_referencia: a.telefono_referencia,
        fecha_nacimiento: a.fecha_nacimiento,
        sexo: a.sexo,
        nacionalidad: a.nacionalidad,
        fecha_creacion: a.fecha_creacion,
        estado: a.estado
      }));

      setEstudiantes(estudiantesMap);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los datos de Estudiantes");
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "curso" || name === "estudiante" ? Number(value) : value,
    });
  };

  const generarReporte = async () => {
    setLoading(true);
    try {
      let url = `${api.defaults.baseURL}/reportes/`;

      switch (tipoReporte) {
        case "calificacionesCurso":
          url += `CalificacionesPorCurso/pdf?idCurso=${form.curso}`;
          break;
        case "calificacionesEstudiante":
          url += `CalificacionesPorEstudiante/pdf?idEstudiante=${form.estudiante}`;
          break;
        case "asistenciasCurso":
          url += `AsistenciasPorCurso/pdf?idCurso=${form.curso}&mes=${form.mes}`;
          break;
        case "asistenciasEstudiante":
          url += `AsistenciaPorEstudiante/pdf?idEstudiante=${form.estudiante}`;
          break;
        case "pagosCurso":
          url += `PagosPorCurso/pdf?idCurso=${form.curso}&estado=${form.estado}&mes=${form.mes}&anio=${form.anio}`;
          break;
        case "pagosEstudiante":
          url += `PagosPorEstudiante/pdf?idEstudiante=${form.estudiante}`;
          break;
        case "listadoEstudiantes":
          url += `EstudiantesPorCurso/pdf?idCurso=${form.curso}`;
          break;
        case "tutoresCurso":
          url += `Tutores/pdf`;
          break;
      }

      const res = await fetch(url, { method: "GET" });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `reporte_${tipoReporte}.pdf`;
      a.click();
      window.URL.revokeObjectURL(a.href);
      setForm({
        curso: 0,
        estudiante: 0,
        paralelo: "",
        mes: 0,
        anio: 0,
        estado: "",
      })
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al generar reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Filtros para Reporte</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {/* Si el reporte necesita curso */}
              {[
                "calificacionesCurso",
                "asistenciasCurso",
                "pagosCurso",
                "listadoEstudiantes",
              ].includes(tipoReporte) && (
                <TextField
                  select
                  label="Curso"
                  name="curso"
                  value={form.curso}
                  onChange={handleChange}
                >
                  {cursos.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre} - {c.paralelo} - {c.gestion}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* Si el reporte necesita estudiante */}
              {[
                "calificacionesEstudiante",
                "asistenciasEstudiante",
                "pagosEstudiante",
              ].includes(tipoReporte) && (
                <TextField
                  select
                  label="Estudiante"
                  name="estudiante"
                  value={form.estudiante}
                  onChange={handleChange}
                >
                  {estudiantes.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.nombres} {e.apellidoPat} {e.apellidoMat}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* Si el reporte necesita mes */}
              {["asistenciasCurso", "pagosCurso"].includes(tipoReporte) && (
                <TextField
                  label="Mes"
                  name="mes"
                  value={form.mes}
                  onChange={handleChange}
                  type="number"
                />
              )}

              {/* Si el reporte necesita año */}
              {["pagosCurso"].includes(tipoReporte) && (
                <TextField
                  label="Año"
                  name="anio"
                  value={form.anio}
                  onChange={handleChange}
                />
              )}

              {/* Si el reporte necesita estado */}
              {["pagosCurso"].includes(tipoReporte) && (
                <TextField
                  select
                  label="Estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <MenuItem value="pagado">Pagado</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                </TextField>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={generarReporte} variant="contained">
            Generar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
