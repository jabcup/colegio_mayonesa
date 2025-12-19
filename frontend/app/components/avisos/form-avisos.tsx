"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Loader2 } from "lucide-react";

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

  const idPersonal = 1;
  const isEditMode = !!avisoToEdit;

  useEffect(() => {
    if (open) {
      cargarCursos();
      if (isEditMode && avisoToEdit) {
        setSelectedCurso(avisoToEdit.Curso);
        setAsunto(avisoToEdit.asunto);
        setMensaje(avisoToEdit.mensaje);
      } else {
        setSelectedCurso(null);
        setAsunto("");
        setMensaje("");
      }
    }
  }, [open, avisoToEdit]);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos/MostrarCursos");
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curso
                      </label>
                      <select
                        value={selectedCurso?.id || ""}
                        onChange={(e) => {
                          const curso = cursos.find(c => c.id === Number(e.target.value));
                          setSelectedCurso(curso || null);
                        }}
                        disabled={isEditMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                      >
                        <option value="">Selecciona un curso</option>
                        {cursos.map((curso) => (
                          <option key={curso.id} value={curso.id}>
                            {getNombreCurso(curso)}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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