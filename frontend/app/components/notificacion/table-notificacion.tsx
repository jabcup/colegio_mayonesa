"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowUpDown } from "lucide-react";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion?: string;
}

interface Notificacion {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
  Estudiante: Estudiante;
}

export default function TableNotificaciones() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingEst, setLoadingEst] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

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
      const res = await api.get(`/notificaciones/Estudiante/${selectedEstudiante.id}`);
      let data = res.data as Notificacion[];
      data = data.sort((a, b) =>
        sortDesc
          ? new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
          : new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
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

  const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getNombreCompleto = (est: Estudiante) =>
    `${est.nombres} ${est.apellidoPat} ${est.apellidoMat} ${est.identificacion ? ` - ${est.identificacion}` : ""}`.trim();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar estudiante
        </label>
        <select
          value={selectedEstudiante?.id || ""}
          onChange={(e) => {
            const est = estudiantes.find((s) => s.id === Number(e.target.value));
            setSelectedEstudiante(est || null);
          }}
          disabled={loadingEst}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        >
          <option value="">
            {loadingEst ? "Cargando estudiantes..." : "Selecciona un estudiante..."}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl font-semibold">
              Notificaciones de:{" "}
              <span className="text-indigo-600">{getNombreCompleto(selectedEstudiante)}</span>
            </h2>
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortDesc ? "Más reciente primero" : "Más antiguo primero"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-900">Estudiante</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Asunto</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Mensaje</th>
                  <th className="px-6 py-4 font-medium text-gray-900">Fecha de Envío</th>
                </tr>
              </thead>
              <tbody>
                {loadingNotif ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                    </td>
                  </tr>
                ) : notificaciones.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500">
                      No hay notificaciones para este estudiante aún.
                    </td>
                  </tr>
                ) : (
                  notificaciones.map((notif) => (
                    <tr key={notif.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{getNombreCompleto(notif.Estudiante)}</td>
                      <td className="px-6 py-4 font-medium">{notif.asunto}</td>
                      <td className="px-6 py-4 max-w-md truncate">{notif.mensaje}</td>
                      <td className="px-6 py-4 text-gray-600">{formatoFecha(notif.fecha_creacion)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}