"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Edit, Trash2, ArrowUpDown, Loader2 } from "lucide-react";

interface Curso {
  id: number;
  nombre: string;
  nivel?: string;
  paralelo?: string;
}

interface Aviso {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
  Curso: Curso;
}

export default function TableAvisos({ onEdit }: { onEdit?: (aviso: Aviso) => void }) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loadingAvisos, setLoadingAvisos] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await api.get("/cursos/MostrarCursos");
        setCursos(res.data);
      } catch {
        toast.error("Error al cargar cursos");
      }
    };
    cargarCursos();
  }, []);

  const cargarAvisos = async () => {
    if (!selectedCurso) return;
    setLoadingAvisos(true);
    try {
      const res = await api.get(`/avisos/Curso/${selectedCurso.id}`);
      let data = res.data as Aviso[];
      data = data.sort((a, b) =>
        sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
      );
      setAvisos(data);
    } catch {
      toast.error("Error al cargar avisos");
      setAvisos([]);
    } finally {
      setLoadingAvisos(false);
    }
  };

  useEffect(() => {
    if (selectedCurso) cargarAvisos();
    else setAvisos([]);
  }, [selectedCurso]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/avisos/${id}`);
      toast.success("Aviso eliminado correctamente");
      cargarAvisos();
    } catch {
      toast.error("Error al eliminar el aviso");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getNombreCurso = (curso: Curso) =>
    `${curso.nombre} ${curso.nivel ? `- ${curso.nivel}` : ""} ${curso.paralelo || ""}`.trim();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar curso
        </label>
        <select
          value={selectedCurso?.id || ""}
          onChange={(e) => {
            const curso = cursos.find(c => c.id === Number(e.target.value));
            setSelectedCurso(curso || null);
          }}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Selecciona un curso...</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {getNombreCurso(curso)}
            </option>
          ))}
        </select>
      </div>

      {selectedCurso && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Avisos de: <span className="text-indigo-600">{getNombreCurso(selectedCurso)}</span>
            </h2>
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortDesc ? "Más reciente" : "Más antiguo"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900">Curso</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Asunto</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Mensaje</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Fecha</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loadingAvisos ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                    </td>
                  </tr>
                ) : avisos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      No hay avisos para este curso aún.
                    </td>
                  </tr>
                ) : (
                  avisos.map((aviso) => (
                    <tr key={aviso.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{getNombreCurso(aviso.Curso)}</td>
                      <td className="px-6 py-4 font-medium">{aviso.asunto}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{aviso.mensaje}</td>
                      <td className="px-6 py-4 text-gray-600">{formatoFecha(aviso.fecha_creacion)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onEdit?.(aviso)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(aviso.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Confirmación de eliminación bonita */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-4">¿Eliminar aviso?</h3>
            <p className="text-gray-600 mb-8">
              Esta acción marcará el aviso como inactivo y no se podrá deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}