"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Loader2, Search, X } from "lucide-react";
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

  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const idPersonal = Number(Cookies.get("personal_id") ?? 0);

  useEffect(() => {
    if (open) {
      cargarEstudiantes();
      setSelectedEstudiante(null);
      setAsunto("");
      setMensaje("");
      setSearchTerm("");
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
    `${est.nombres} ${est.apellidoPat} ${est.apellidoMat}${
      est.identificacion ? ` - ${est.identificacion}` : ""
    }`.trim();

  // Filtrar estudiantes según el término de búsqueda
  const estudiantesFiltrados = estudiantes.filter((est) => {
    const nombreCompleto = getNombreCompleto(est).toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  const seleccionarEstudiante = (est: Estudiante) => {
    setSelectedEstudiante(est);
    setSearchTerm(getNombreCompleto(est));
    setShowDropdown(false);
  };

  const limpiarEstudiante = () => {
    setSelectedEstudiante(null);
    setSearchTerm("");
    setShowDropdown(true);
  };

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
                    {/* BUSCADOR DE ESTUDIANTE */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estudiante
                      </label>
                      <div className="relative">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                          <Search className="h-5 w-5 text-gray-400 ml-3" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setShowDropdown(true);
                              if (!e.target.value.trim()) {
                                setSelectedEstudiante(null);
                              }
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Buscar estudiante..."
                            className="w-full px-3 py-3 outline-none rounded-lg"
                          />
                          {selectedEstudiante && (
                            <button
                              onClick={limpiarEstudiante}
                              className="mr-3 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* Dropdown con resultados */}
                        {showDropdown && searchTerm && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {estudiantesFiltrados.length > 0 ? (
                              estudiantesFiltrados.map((est) => (
                                <button
                                  key={est.id}
                                  onClick={() => seleccionarEstudiante(est)}
                                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b last:border-b-0 transition"
                                >
                                  <div className="font-medium">
                                    {est.nombres} {est.apellidoPat} {est.apellidoMat}
                                  </div>
                                  {est.identificacion && (
                                    <div className="text-sm text-gray-500">
                                      {est.identificacion}
                                    </div>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center text-gray-500">
                                No se encontraron estudiantes
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedEstudiante && (
                        <p className="mt-2 text-sm text-indigo-600 font-medium">
                          Seleccionado: {getNombreCompleto(selectedEstudiante)}
                        </p>
                      )}
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
                    disabled={loading || !selectedEstudiante}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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