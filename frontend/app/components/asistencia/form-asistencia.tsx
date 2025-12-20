"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Loader2 } from "lucide-react";

interface AsignacionClase {
  idCurso: number;
  nombre: string;
  paralelo: string;
}

interface AsignacionDocente {
  idAsignacion: number;
  nombre: string;
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { idAsignacion: number; idEstudiante: number; asistencia: string }) => void;
}

export default function FormAsistencia({ open, onClose, onCreate }: Props) {
  const [cursosDocente, setCursosDocente] = useState<AsignacionClase[]>([]);
  const [materiasCurso, setMateriasCurso] = useState<AsignacionDocente[]>([]);
  const [estudiantesCurso, setEstudiantesCurso] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    idCurso: "",
    idAsignacion: "",
    idEstudiante: "",
    asistencia: "presente",
  });

  useEffect(() => {
    if (open) {
      cargarCursos();
      setForm({
        idCurso: "",
        idAsignacion: "",
        idEstudiante: "",
        asistencia: "presente",
      });
    }
  }, [open]);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const idDocente = 4; // Cambia si usas cookie
      const res = await api.get(`/asignacion-clases/por-docente/${idDocente}`);
      const mapped = res.data.map((a: any) => ({
        idCurso: a.id,
        nombre: a.nombre,
        paralelo: a.paralelo,
      }));
      setCursosDocente(mapped);
    } catch {
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleCursoChange = async (value: string) => {
    setForm({ ...form, idCurso: value, idAsignacion: "", idEstudiante: "" });
    if (!value) {
      setMateriasCurso([]);
      setEstudiantesCurso([]);
      return;
    }

    const idDocente = 4;
    setLoading(true);
    try {
      // Cargar estudiantes
      const estRes = await api.get(`/estudiante-curso/estudiantes-por-curso/${value}`);
      const estudiantesMapped = estRes.data.map((ec: any) => ec.estudiante);
      setEstudiantesCurso(estudiantesMapped);

      // Cargar materias
      const matRes = await api.get(`/asignacion-clases/materias-por-docente-curso/${idDocente}/${value}`);
      const materiasMapped = matRes.data.map((m: any) => ({
        idAsignacion: m.id,
        nombre: m.nombre,
      }));
      setMateriasCurso(materiasMapped);
    } catch {
      toast.error("Error al cargar datos del curso");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.idAsignacion || !form.idEstudiante) {
      toast.warning("Selecciona curso, materia y estudiante");
      return;
    }

    onCreate({
      idAsignacion: Number(form.idAsignacion),
      idEstudiante: Number(form.idEstudiante),
      asistencia: form.asistencia,
    });

    toast.success("Asistencia registrada correctamente");
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                  Registrar Asistencia Individual
                </Dialog.Title>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                      <select value={form.idCurso} onChange={(e) => handleCursoChange(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Selecciona un curso</option>
                        {cursosDocente.map((c) => (
                          <option key={c.idCurso} value={c.idCurso}>
                            {c.nombre} - {c.paralelo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                      <select value={form.idAsignacion} onChange={(e) => setForm({ ...form, idAsignacion: e.target.value })} disabled={!form.idCurso} className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100">
                        <option value="">Selecciona una materia</option>
                        {materiasCurso.map((m) => (
                          <option key={m.idAsignacion} value={m.idAsignacion}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante</label>
                      <select value={form.idEstudiante} onChange={(e) => setForm({ ...form, idEstudiante: e.target.value })} disabled={!form.idCurso} className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100">
                        <option value="">Selecciona un estudiante</option>
                        {estudiantesCurso.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nombres} {e.apellidoPat} {e.apellidoMat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asistencia</label>
                      <select value={form.asistencia} onChange={(e) => setForm({ ...form, asistencia: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="presente">Presente</option>
                        <option value="falta">Falta</option>
                        <option value="ausente">Ausente</option>
                        <option value="justificativo">Justificativo</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <button onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button onClick={handleSubmit} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Registrar Asistencia
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