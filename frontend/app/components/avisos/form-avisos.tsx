"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Loader2, Search, X } from "lucide-react";

interface Curso {
  id: number;
  nombre: string;
  nivel?: string;
  paralelo?: {
    id: number;
    nombre: string;
  };
}

interface AvisoExisting {
  id: number;
  asunto: string;
  mensaje: string;
  Curso: Curso;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  avisoToEdit?: AvisoExisting | null;
}

export default function FormAviso({ open, onClose, onSuccess, avisoToEdit }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const idPersonal = 1;
  const isEditMode = !!avisoToEdit;

  useEffect(() => {
    if (open) {
      cargarCursos();
      if (isEditMode && avisoToEdit) {
        setSelectedCurso(avisoToEdit.Curso);
        setSearchTerm(getNombreCurso(avisoToEdit.Curso));
        setAsunto(avisoToEdit.asunto);
        setMensaje(avisoToEdit.mensaje);
      } else {
        setSelectedCurso(null);
        setSearchTerm("");
        setAsunto("");
        setMensaje("");
      }
    }
  }, [open, avisoToEdit]);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos/cursosActivos");
      setCursos(res.data);
    } catch {
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCurso || !asunto.trim() || !mensaje.trim()) {
      toast.warning("Por favor completa todos los campos");
      return;
    }

    const payload = {
      idCurso: selectedCurso.id,
      idPersonal,
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
    };

    try {
      if (isEditMode) {
        await api.put(`/avisos/${avisoToEdit!.id}`, payload);
        toast.success("Aviso actualizado correctamente");
      } else {
        await api.post("/avisos/CrearAviso", payload);
        toast.success("Aviso enviado con éxito");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(`Error al ${isEditMode ? "actualizar" : "enviar"} el aviso`);
    }
  };

  const getNombreCurso = (curso: Curso) =>
    `${curso.nombre} ${curso.nivel ? `- ${curso.nivel}` : ""} ${curso.paralelo?.nombre || ""}`.trim();

  // Filtrar cursos
  const cursosFiltrados = cursos.filter((curso) => {
    const nombreCompleto = getNombreCurso(curso).toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  const seleccionarCurso = (curso: Curso) => {
    setSelectedCurso(curso);
    setSearchTerm(getNombreCurso(curso));
    setShowDropdown(false);
  };

  const limpiarCurso = () => {
    setSelectedCurso(null);
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
                  {isEditMode ? "Editar Aviso" : "Nuevo Aviso al Curso"}
                </Dialog.Title>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* BUSCADOR DE CURSO */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curso
                      </label>
                      <div className="relative">
                        <div className={`flex items-center border rounded-lg bg-white ${isEditMode ? "bg-gray-100 border-gray-300" : "border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"}`}>
                          <Search className="h-5 w-5 text-gray-400 ml-3" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              if (!isEditMode) {
                                setShowDropdown(true);
                                if (!e.target.value.trim()) {
                                  setSelectedCurso(null);
                                }
                              }
                            }}
                            onFocus={() => !isEditMode && setShowDropdown(true)}
                            placeholder={isEditMode ? getNombreCurso(selectedCurso!) : "Buscar curso..."}
                            readOnly={isEditMode}
                            className={`w-full px-3 py-3 outline-none rounded-lg ${isEditMode ? "cursor-not-allowed" : ""}`}
                          />
                          {!isEditMode && selectedCurso && (
                            <button
                              onClick={limpiarCurso}
                              className="mr-3 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* Dropdown solo en modo creación */}
                        {!isEditMode && showDropdown && searchTerm && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {cursosFiltrados.length > 0 ? (
                              cursosFiltrados.map((curso) => (
                                <button
                                  key={curso.id}
                                  onClick={() => seleccionarCurso(curso)}
                                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b last:border-b-0 transition"
                                >
                                  <div className="font-medium">
                                    {curso.nombre} {curso.nivel && `- ${curso.nivel}`}
                                  </div>
                                  {curso.paralelo && (
                                    <div className="text-sm text-gray-500">
                                      Paralelo {curso.paralelo.nombre}
                                    </div>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center text-gray-500">
                                No se encontraron cursos
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedCurso && !isEditMode && (
                        <p className="mt-2 text-sm text-indigo-600 font-medium">
                          Seleccionado: {getNombreCurso(selectedCurso)}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: Tarea de matemáticas"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="Escribe el mensaje completo..."
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
                    disabled={loading || !selectedCurso}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditMode ? "Guardar Cambios" : "Enviar Aviso"}
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