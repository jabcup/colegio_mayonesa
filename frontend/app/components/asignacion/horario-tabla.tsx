import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

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

interface HorarioTableProps {
  asignaciones: Asignacion[];
  onAsignar: (dia: string, idHorario: number) => void; // Llamar al formulario de asignación
}

export default function HorarioTabla ({ asignaciones, onAsignar }: HorarioTableProps) {
  const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
  const horarios = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:20 - 11:20",
    "11:20 - 12:20",
  ];

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
        {horarios.map((horario, index) => (
          <TableRow key={index}>
            <TableCell>{horario}</TableCell>
            {dias.map((dia) => {
              const asignacion = asignaciones.find(
                (a) => a.dia === dia && a.horario === horario
              );
              return (
                <TableCell key={dia}>
                  {asignacion ? (
                    <>
                      <div>{asignacion.docente}</div>
                      <div>{asignacion.materia}</div>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onAsignar(dia, index + 1)}
                    >
                      Asignar
                    </Button>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
