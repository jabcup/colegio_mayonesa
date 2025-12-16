"use client";

import { Box, Paper, Typography, List, ListItem, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface Notificacion {
  id: number;
  asunto: string;
  mensaje: string;
  fecha_creacion: string;
  Personal: {
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
  };
}

interface Props {
  idEstudiante: number;
}

export default function TableNotificacionesEstudiante({ idEstudiante }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    if (!idEstudiante) return;

    const fetchNotificaciones = async () => {
      try {

        const cursoRes = await api.get(`/estudiante-curso/cursoEstudiante/${idEstudiante}`);

        const idCurso = cursoRes.data?.[0]?.curso?.id;


        const notiEstudianteReq = api.get(
          `/notificaciones/Estudiante/${idEstudiante}`
        );
        console.log(idCurso);
        
        const notiCursoReq = idCurso
          ? api.get(`/avisos/Curso/${idCurso}`)
          : Promise.resolve({ data: [] });

        const [notiEstudianteRes, notiCursoRes] = await Promise.all([
          notiEstudianteReq,
          notiCursoReq,
        ]);

        const todas = [...notiEstudianteRes.data, ...notiCursoRes.data];

        const ordenadas = todas.sort(
          (a: Notificacion, b: Notificacion) =>
            new Date(b.fecha_creacion).getTime() -
            new Date(a.fecha_creacion).getTime()
        );

        setNotificaciones(ordenadas);
      } catch (error) {
        console.error("Error al obtener notificaciones", error);
      }
    };

    fetchNotificaciones();
  }, [idEstudiante]);

  return (
    <Paper sx={{ p: 2, width: "95%", mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Notificaciones
      </Typography>

      <List>
        {notificaciones.map((n) => (
          <Box key={n.id}>
            <ListItem alignItems="flex-start">
              <Box sx={{ width: "100%" }}>
                <Typography fontWeight="bold">{n.asunto}</Typography>

                <Typography variant="body2" sx={{ my: 0.5 }}>
                  {n.mensaje}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {n.Personal.nombres} {n.Personal.apellidoPat}{" "}
                  {n.Personal.apellidoMat} —{" "}
                  {dayjs(n.fecha_creacion).format(
                    "dddd D [de] MMMM YYYY HH:mm"
                  )}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </Box>
        ))}

        {notificaciones.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
            No hay notificaciones
          </Typography>
        )}
      </List>
    </Paper>
  );
}
