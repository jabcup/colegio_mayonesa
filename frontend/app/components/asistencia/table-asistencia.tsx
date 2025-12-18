"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

interface MateriaDocente {
  idMateria: number;
  nombre: string;
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

interface AsistenciaFiltrada {
  id: number;
  asistencia: string;
  fecha: string;
  estudiante: Estudiante;
  materia: { id: number; nombre: string };
}

type Mode = "none" | "add" | "view";

interface BatchAsistencia {
  estudiante: Estudiante;
  asistencia: string;
}

export default function TableAsistencia() {
  const [mode, setMode] = useState<Mode>("none");
  const [cursos, setCursos] = useState<AsignacionClase[]>([]);
  const [materias, setMaterias] = useState<MateriaDocente[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [batch, setBatch] = useState<BatchAsistencia[]>([]);
  const [historial, setHistorial] = useState<AsistenciaFiltrada[]>([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState({
    idCurso: "",
    idMateria: "",
    idEstudiante: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    const idDocente = Number(Cookies.get("personal_id") ?? 4);
    try {
      const res = await api.get(`/asignacion-clases/por-docente/${idDocente}`);
      setCursos(res.data.map((a: any) => ({ idCurso: a.id, nombre: a.nombre, paralelo: a.paralelo })));
    } catch {
      toast.error("Error al cargar cursos");
    }
  };

  const handleCursoChange = async (value: string) => {
    setFiltro({ ...filtro, idCurso: value, idMateria: "", idEstudiante: "" });
    setMaterias([]);
    setEstudiantes([]);
    setBatch([]);

    if (!value) return;

    const idDocente = Number(Cookies.get("personal_id") ?? 4);
    setLoading(true);
    try {
      const estRes = await api.get(`/estudiante-curso/estudiantes-por-curso/${value}`);
      setEstudiantes(estRes.data.map((ec: any) => ec.estudiante));

      const matRes = await api.get(`/asignacion-clases/materias-por-docente-curso/${idDocente}/${value}`);
      setMaterias(matRes.data.map((m: any) => ({ idMateria: m.id, nombre: m.nombre })));
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarBatch = () => {
    if (!filtro.idCurso || !filtro.idMateria) {
      toast.warning("Selecciona curso y materia");
      return;
    }
    const nuevoBatch = estudiantes.map((e) => ({ estudiante: e, asistencia: "presente" }));
    setBatch(nuevoBatch);
  };

  const handleAsistenciaChange = (id: number, value: string) => {
    setBatch(batch.map((b) => (b.estudiante.id === id ? { ...b, asistencia: value } : b)));
  };

  const registrarBatch = async () => {
    const payload = batch.map((b) => ({
      idAsignacion: Number(filtro.idMateria),
      idEstudiante: b.estudiante.id,
      asistencia: b.asistencia,
    }));

    try {
      await api.post("/asistencias/batch", payload);
      toast.success("Asistencias registradas con éxito");
      setBatch([]);
      setMode("none");
    } catch {
      toast.error("Error al registrar asistencias");
    }
  };

  const buscarHistorial = async () => {
    if (!filtro.idCurso || !filtro.idMateria || !filtro.idEstudiante || !filtro.fromDate || !filtro.toDate) {
      toast.warning("Completa todos los filtros");
      return;
    }

    try {
      const res = await api.get(
        `/asistencias/BuscarAsistenciasPorCursoYMateria/${filtro.idCurso}/${filtro.idMateria}?estudianteId=${filtro.idEstudiante}&fromDate=${filtro.fromDate}&toDate=${filtro.toDate}`
      );
      setHistorial(res.data.asistencias || []);
    } catch {
      toast.error("Error al buscar asistencias");
    }
  };

  const nombreCompleto = (e: Estudiante) => `${e.nombres} ${e.apellidoPat} ${e.apellidoMat}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <button onClick={() => setMode("add")} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Registrar Asistencia (Lote)
        </button>
        <button onClick={() => setMode("view")} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          Ver Historial de Asistencias
        </button>
        {mode !== "none" && (
          <button onClick={() => setMode("none")} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
        )}
      </div>

      {mode !== "none" && (
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Curso</label>
            <select value={filtro.idCurso} onChange={(e) => handleCursoChange(e.target.value)} className="px-4 py-3 border rounded-lg min-w-48">
              <option value="">Seleccionar curso</option>
              {cursos.map((c) => (
                <option key={c.idCurso} value={c.idCurso}>
                  {c.nombre} - {c.paralelo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Materia</label>
            <select value={filtro.idMateria} onChange={(e) => setFiltro({ ...filtro, idMateria: e.target.value })} disabled={!filtro.idCurso} className="px-4 py-3 border rounded-lg min-w-48 disabled:bg-gray-100">
              <option value="">Seleccionar materia</option>
              {materias.map((m) => (
                <option key={m.idMateria} value={m.idMateria}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading && <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />}

      {/* Modo Agregar Lote */}
      {mode === "add" && filtro.idMateria && (
        <>
          <button onClick={cargarBatch} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Cargar Lista de Estudiantes
          </button>

          {batch.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Estudiante</th>
                    <th className="px-6 py-4 text-left font-medium">Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.map((b) => (
                    <tr key={b.estudiante.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{nombreCompleto(b.estudiante)}</td>
                      <td className="px-6 py-4">
                        <select value={b.asistencia} onChange={(e) => handleAsistenciaChange(b.estudiante.id, e.target.value)} className="px-4 py-2 border rounded-lg">
                          <option value="presente">Presente</option>
                          <option value="falta">Falta</option>
                          <option value="ausente">Ausente</option>
                          <option value="justificativo">Justificativo</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {batch.length > 0 && (
            <button onClick={registrarBatch} className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium">
              Finalizar y Registrar Todas las Asistencias
            </button>
          )}
        </>
      )}

      {/* Modo Ver Historial */}
      {mode === "view" && filtro.idMateria && (
        <>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Estudiante</label>
              <select value={filtro.idEstudiante} onChange={(e) => setFiltro({ ...filtro, idEstudiante: e.target.value })} className="px-4 py-3 border rounded-lg min-w-64">
                <option value="">Seleccionar estudiante</option>
                {estudiantes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {nombreCompleto(e)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Desde</label>
              <input type="date" value={filtro.fromDate} onChange={(e) => setFiltro({ ...filtro, fromDate: e.target.value })} className="px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <input type="date" value={filtro.toDate} onChange={(e) => setFiltro({ ...filtro, toDate: e.target.value })} className="px-4 py-3 border rounded-lg" />
            </div>

            <button onClick={buscarHistorial} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Buscar
            </button>
          </div>

          {historial.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Estudiante</th>
                    <th className="px-6 py-4 text-left font-medium">Asistencia</th>
                    <th className="px-6 py-4 text-left font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{nombreCompleto(a.estudiante)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          a.asistencia === "presente" ? "bg-green-100 text-green-800" :
                          a.asistencia === "falta" ? "bg-red-100 text-red-800" :
                          a.asistencia === "ausente" ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {a.asistencia.charAt(0).toUpperCase() + a.asistencia.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(a.fecha).toLocaleDateString("es-BO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}