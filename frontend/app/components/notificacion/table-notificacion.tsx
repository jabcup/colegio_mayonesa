"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowUpDown, Pencil, Trash2 } from "lucide-react";

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
        idPersonal: editNotif.Personal?.id || 1, // ajustar según tu backend
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

  return (
    <div className="space-y-6">
      {/* SELECT ESTUDIANTE */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Buscar estudiante
        </label>
        <select
          value={selectedEstudiante?.id || ""}
          onChange={(e) => {
            const est = estudiantes.find(
              (s) => s.id === Number(e.target.value)
            );
            setSelectedEstudiante(est || null);
          }}
          disabled={loadingEst}
          className="w-full max-w-md px-4 py-3 border rounded-lg"
        >
          <option value="">
            {loadingEst
              ? "Cargando estudiantes..."
              : "Selecciona un estudiante..."}
          </option>
          {estudiantes.map((est) => (
            <option key={est.id} value={est.id}>
              {getNombreCompleto(est)}
            </option>
          ))}
        </select>
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
