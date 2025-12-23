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
  idAsignacion: number;
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
  idAsignacion: number;
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
    idAsignacion: "",
  });

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    const idDocente = Number(Cookies.get("personal_id") ?? 4);
    try {
      const res = await api.get(`/asignacion-clases/por-docente/${idDocente}`);
      setCursos(
        res.data.map((a: any) => ({
          idCurso: a.id,
          nombre: a.nombre,
          paralelo: a.paralelo,
        }))
      );
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
      const estRes = await api.get(
        `/estudiante-curso/estudiantes-por-curso/${value}`
      );
      setEstudiantes(estRes.data.map((ec: any) => ec.estudiante));

      const matRes = await api.get(
        `/asignacion-clases/materias-por-docente-curso-asignacion/${idDocente}/${value}`
      );
      setMaterias(
        matRes.data.map((m: any) => ({
          idAsignacion: m.idAsignacion,
          idMateria: m.idMateria,
          nombre: m.nombre,
        }))
      );
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
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


  const buscarHistorial = async () => {
    if (
      !filtro.idCurso ||
      !filtro.idMateria ||
      !filtro.idEstudiante ||
      !filtro.fromDate ||
      !filtro.toDate
    ) {
      toast.warning("Completa todos los filtros");
      return;
    }
    console.log(filtro);

    try {
      const res = await api.get(
        `/asistencias/BuscarAsistenciasPorCursoYMateria/${filtro.idCurso}/${filtro.idMateria}?estudianteId=${filtro.idEstudiante}&fromDate=${filtro.fromDate}&toDate=${filtro.toDate}`
      );
      const asistenciasCrudas = res.data.asistencias || [];

      const asistenciasTransformadas: AsistenciaFiltrada[] = asistenciasCrudas.map((item: any) => ({
        id: item.asistencia_id,
        asistencia: item.asistencia_asistencia,
        fecha: item.fecha,
        estudiante: {
          id: item.estudiante_id,
          nombres: item.estudiante_nombres,
          apellidoPat: item.estudiante_apellidoPat,
          apellidoMat: item.estudiante_apellidoMat,
        },
        materia: {
          id: item.materia_id,
          nombre: item.materia_nombre,
        },
      }));

      setHistorial(asistenciasTransformadas);
    } catch {
      toast.error("Error al buscar asistencias");
    }
  };


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
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setMode("add")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Registrar Asistencia (Lote)
        </button>
        <button
          onClick={() => setMode("view")}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          Ver Historial de Asistencias
        </button>
        {mode !== "none" && (
          <button
            onClick={() => setMode("none")}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>

      {mode !== "none" && (
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Curso</label>
            <select
              value={filtro.idCurso}
              onChange={(e) => handleCursoChange(e.target.value)}
              className="px-4 py-3 border rounded-lg min-w-48"
            >
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
            <select
              value={filtro.idAsignacion}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setFiltro({ ...filtro, idAsignacion: "", idMateria: "" });
                  return;
                }

                const asignacion = materias.find(
                  (m) => m.idAsignacion === Number(value)
                );

                if (!asignacion) {
                  toast.error("Materia no encontrada");
                  return;
                }

                setFiltro({
                  ...filtro,
                  idAsignacion: value,
                  idMateria: asignacion.idMateria.toString(),
                });
              }}
            >
              <option value="">Seleccionar materia</option>
              {materias.map((m) => (
                <option key={m.idAsignacion} value={m.idAsignacion}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading && (
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
      )}

      {/* Modo Agregar Lote */}
      {mode === "add" && filtro.idAsignacion && (
        <>
          <button
            onClick={cargarBatch}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Cargar Lista de Estudiantes
          </button>

          {batch.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">
                      Estudiante
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Asistencia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {batch.map((b) => (
                    <tr
                      key={b.estudiante.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {nombreCompleto(b.estudiante)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={b.asistencia}
                          onChange={(e) =>
                            handleAsistenciaChange(
                              b.estudiante.id,
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border rounded-lg"
                        >
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
            <button
              onClick={registrarBatch}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium"
            >
              Finalizar y Registrar Todas las Asistencias
            </button>
          )}
        </>
      )}

      {/* Modo Ver Historial */}
      {mode === "view" && filtro.idAsignacion && (
        <>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">
                Estudiante
              </label>
              <select
                value={filtro.idEstudiante}
                onChange={(e) =>
                  setFiltro({ ...filtro, idEstudiante: e.target.value })
                }
                className="px-4 py-3 border rounded-lg min-w-64"
              >
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
              <input
                type="date"
                value={filtro.fromDate}
                onChange={(e) =>
                  setFiltro({ ...filtro, fromDate: e.target.value })
                }
                className="px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <input
                type="date"
                value={filtro.toDate}
                onChange={(e) =>
                  setFiltro({ ...filtro, toDate: e.target.value })
                }
                className="px-4 py-3 border rounded-lg"
              />
            </div>

            <button
              onClick={buscarHistorial}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Buscar
            </button>
          </div>

          {historial.length > 0 && (
            <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">
                      Estudiante
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Asistencia
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {nombreCompleto(a.estudiante)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            a.asistencia === "presente"
                              ? "bg-green-100 text-green-800"
                              : a.asistencia === "falta"
                              ? "bg-red-100 text-red-800"
                              : a.asistencia === "ausente"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {(a.asistencia || "desconocido")
                            .trim()
                            .replace(/^\w/, (c) => c.toUpperCase()) ||
                            "Desconocido"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(a.fecha).toLocaleDateString("es-BO")}
                      </td>
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
