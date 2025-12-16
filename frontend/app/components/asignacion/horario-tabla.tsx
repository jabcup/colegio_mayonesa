import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";

import { getAuthData } from "@/app/lib/auth";

interface Asignacion {
  idAsignacion: number;
  dia: string;
  idHorario: number;
  horario: string;
  idDocente: number;
  docente: string;
  idMateria: number;
  materia: string;
}

interface EditContext {
  idAsignacion: number;
  dia: string;
  idHorario: number;
  idDocente: number;
  idMateria: number;
}

interface HorarioTableProps {
  asignaciones: Asignacion[];
  horarios: { id: number; horario: string }[];
  onAsignar: (dia: string, idHorario: number) => void;
  onEditar: (data: EditContext) => void;
}

export default function HorarioTabla({
  asignaciones,
  onAsignar,
  onEditar,
  horarios,
}: HorarioTableProps) {
  const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

  const { rol } = getAuthData();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Hora/Día</TableCell>
          {dias.map((dia) => (
            <TableCell key={dia}>{dia}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {horarios.map((h, index) => (
          <TableRow key={index}>
            <TableCell>{h.horario}</TableCell>
            {dias.map((dia) => {
              const asignacion = asignaciones.find(
                (a) => a.dia === dia && a.idHorario === h.id
              );
              return (
                <TableCell key={dia}>
                  {asignacion ? (
                    <>
                      <Typography fontWeight="bold">
                        {asignacion.materia}
                      </Typography>
                      <Typography variant="body2">
                        {asignacion.docente}
                      </Typography>
                      {rol !== "Docente" && (
                      <Button
                        color="warning"
                        onClick={() =>
                          onEditar({
                            idAsignacion: asignacion.idAsignacion,
                            dia: asignacion.dia,
                            idHorario: asignacion.idHorario,
                            idDocente: asignacion.idDocente,
                            idMateria: asignacion.idMateria,
                          })
                        }
                      >
                        Editar
                      </Button>
                      )}
                    </>
                  ) : rol !== "Docente" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onAsignar(dia, index + 1)}
                    >
                      Asignar
                    </Button>
                  ) : (
                    <span style={{ color: "red" }}>Aún no definido</span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
