"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  identificacion?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormNotificacion({ open, onClose, onSuccess }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const idPersonal = Number(Cookies.get("personal_id") ?? 0);

  useEffect(() => {
    if (open) {
      cargarEstudiantes();
      setSelectedEstudiante(null);
      setAsunto("");
      setMensaje("");
    }
  }, [open]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/estudiante/MostrarEstudiantes");
      setEstudiantes(res.data);
    } catch {
      toast.error("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEstudiante || !asunto.trim() || !mensaje.trim()) {
      toast.warning("Por favor completa todos los campos");
      return;
    }

    const payload = {
      idEstudiante: selectedEstudiante.id,
      idPersonal,
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
    };

    try {
      await api.post("/notificaciones/CrearNotificacion", payload);
      toast.success("Notificación enviada con éxito");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al enviar la notificación");
    }
  };

  const getNombreCompleto = (est: Estudiante) =>
    `${est.nombres} ${est.apellidoPat} ${est.apellidoMat} ${est.identificacion ? ` - ${est.identificacion}` : ""}`.trim();

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                  Enviar Nueva Notificación
                </Dialog.Title>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estudiante
                      </label>
                      <select
                        value={selectedEstudiante?.id || ""}
                        onChange={(e) => {
                          const est = estudiantes.find((s) => s.id === Number(e.target.value));
                          setSelectedEstudiante(est || null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Selecciona un estudiante</option>
                        {estudiantes.map((est) => (
                          <option key={est.id} value={est.id}>
                            {getNombreCompleto(est)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asunto
                      </label>
                      <input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        placeholder="Ej: Recordatorio de pago"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        rows={6}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe el mensaje detallado..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Enviar Notificación
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}