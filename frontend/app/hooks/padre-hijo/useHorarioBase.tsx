// hooks/useHorarioBase.ts
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
export type TipoAsistencia = "presente" | "falta" | "justificativo" | "ausente";

export interface AsignacionClaseRef {
  id: number;
  dia: string;
  fecha_creacion: string;
  estado: string;
}

export interface Asistencia {
  id: number;
  asignacionClase: AsignacionClaseRef;
  asistencia: TipoAsistencia;
  fecha_creacion: string;
  estado: string;
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HORARIOS_BASE = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
];

export function useHorarioBase(idEstudiante: number) {
  const [mapa, setMapa] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!idEstudiante) return;

    api.get(`/asignacion-clases/estudiante/${idEstudiante}`).then((res) => {
      const temp: Record<string, any> = {};

      res.data.forEach((a: any) => {
        const h = a.horario.horario;
        const d = a.dia;

        if (!temp[h]) temp[h] = {};
        temp[h][d] = a;
      });

      setMapa(temp);
    });
  }, [idEstudiante]);

  return {
    dias: DIAS_SEMANA,
    horarios: HORARIOS_BASE,
    mapa,
  };
}
