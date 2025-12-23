"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowUpDown, Pencil, Trash2, Search } from "lucide-react";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion?: string;
}

interface Personal {
  id: number;
  nombres: string;
}

interface Notificacion {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
  Estudiante: Estudiante;
  Personal?: Personal;
}

export default function TableNotificaciones() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] =
    useState<Estudiante | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingEst, setLoadingEst] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  // Nuevos estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Para edición
  const [editNotif, setEditNotif] = useState<Notificacion | null>(null);
  const [editAsunto, setEditAsunto] = useState("");
  const [editMensaje, setEditMensaje] = useState("");

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoadingEst(true);
    try {
      const res = await api.get("/estudiante/MostrarEstudiantes");
      setEstudiantes(res.data);
    } catch {
      toast.error("Error al cargar estudiantes");
    } finally {
      setLoadingEst(false);
    }
  };

  const cargarNotificaciones = async () => {
    if (!selectedEstudiante) return;
    setLoadingNotif(true);
    try {
      const res = await api.get(
        `/notificaciones/Estudiante/${selectedEstudiante.id}`
      );
      let data = res.data as Notificacion[];

      data = data.sort((a, b) =>
        sortDesc
          ? new Date(b.fecha_creacion).getTime() -
            new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() -
            new Date(b.fecha_creacion).getTime()
      );

      setNotificaciones(data);
    } catch {
      toast.error("Error al cargar notificaciones");
      setNotificaciones([]);
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    if (selectedEstudiante) cargarNotificaciones();
    else setNotificaciones([]);
  }, [selectedEstudiante, sortDesc]);

  const eliminarNotificacion = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta notificación?")) return;
    try {
      await api.delete(`/notificaciones/${id}`);
      toast.success("Notificación eliminada");
      cargarNotificaciones();
    } catch {
      toast.error("Error al eliminar notificación");
    }
  };

  const abrirEdicion = (notif: Notificacion) => {
    setEditNotif(notif);
    setEditAsunto(notif.asunto);
    setEditMensaje(notif.mensaje);
  };

  const guardarEdicion = async () => {
    if (!editNotif || !selectedEstudiante) return;
    try {
      await api.put(`/notificaciones/${editNotif.id}`, {
        idEstudiante: selectedEstudiante.id,
        idPersonal: editNotif.Personal?.id || 1,
        asunto: editAsunto,
        mensaje: editMensaje,
      });
      toast.success("Notificación actualizada");
      setEditNotif(null);
      cargarNotificaciones();
    } catch {
      toast.error("Error al actualizar notificación");
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

  const getNombreCompleto = (est: Estudiante) =>
    `${est.nombres} ${est.apellidoPat} ${est.apellidoMat}${
      est.identificacion ? ` - ${est.identificacion}` : ""
    }`.trim();

  // Filtrar estudiantes según el término de búsqueda
  const estudiantesFiltrados = estudiantes.filter((est) => {
    const nombreCompleto = getNombreCompleto(est).toLowerCase();
    const term = searchTerm.toLowerCase();
    return nombreCompleto.includes(term);
  });

  const seleccionarEstudiante = (est: Estudiante) => {
    setSelectedEstudiante(est);
    setSearchTerm(getNombreCompleto(est)); // Mostrar el nombre seleccionado
    setShowDropdown(false);
  };

  const limpiarSeleccion = () => {
    setSelectedEstudiante(null);
    setSearchTerm("");
    setShowDropdown(true);
  };

  return (
    <div className="space-y-6">
      {/* BUSCADOR DE ESTUDIANTE */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">
          Buscar estudiante
        </label>
        <div className="relative max-w-md">
          <div className="flex items-center border rounded-lg bg-white">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) {
                  setSelectedEstudiante(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Escribe para buscar un estudiante..."
              className="w-full px-3 py-3 outline-none rounded-lg"
              disabled={loadingEst}
            />
            {selectedEstudiante && (
              <button
                onClick={limpiarSeleccion}
                className="mr-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown con resultados */}
          {showDropdown && searchTerm && estudiantesFiltrados.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {estudiantesFiltrados.map((est) => (
                <button
                  key={est.id}
                  onClick={() => seleccionarEstudiante(est)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b last:border-b-0"
                >
                  <div className="font-medium">{est.nombres} {est.apellidoPat} {est.apellidoMat}</div>
                  {est.identificacion && (
                    <div className="text-sm text-gray-500">{est.identificacion}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchTerm && estudiantesFiltrados.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
              No se encontraron estudiantes
            </div>
          )}

          {loadingEst && (
            <div className="absolute inset-x-0 top-12 text-center">
              <Loader2 className="animate-spin mx-auto mt-4" />
            </div>
          )}
        </div>

        {selectedEstudiante && (
          <p className="mt-2 text-sm text-gray-600">
            Estudiante seleccionado: <strong>{getNombreCompleto(selectedEstudiante)}</strong>
          </p>
        )}
      </div>

      {selectedEstudiante && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Notificaciones de{" "}
              <span className="text-indigo-600">
                {getNombreCompleto(selectedEstudiante)}
              </span>
            </h2>
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortDesc ? "Más reciente primero" : "Más antiguo primero"}
            </button>
          </div>

          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Estudiante</th>
                  <th className="px-6 py-4">Asunto</th>
                  <th className="px-6 py-4">Mensaje</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loadingNotif ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Loader2 className="animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : notificaciones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      No hay notificaciones
                    </td>
                  </tr>
                ) : (
                  notificaciones.map((n) => (
                    <tr key={n.id} className="border-b">
                      <td className="px-6 py-4">
                        {getNombreCompleto(n.Estudiante)}
                      </td>
                      <td className="px-6 py-4 font-medium">{n.asunto}</td>
                      <td className="px-6 py-4 truncate max-w-md">
                        {n.mensaje}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatoFecha(n.fecha_creacion)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => abrirEdicion(n)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => eliminarNotificacion(n.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL EDICIÓN */}
      {editNotif && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Editar Notificación</h3>
            <input
              value={editAsunto}
              onChange={(e) => setEditAsunto(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Asunto"
            />
            <textarea
              value={editMensaje}
              onChange={(e) => setEditMensaje(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              rows={4}
              placeholder="Mensaje"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditNotif(null)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}