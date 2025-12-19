// components/calificacion/table-calificacion-trimestral.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EstudianteCalificacion {
  estudianteId: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  nombresCompletos: string;
  trim1: number | null;
  trim2: number | null;
  trim3: number | null;
  aprobacion: boolean;
  registroId: number | null;
}

interface TableCalificacionTrimestralProps {
  data: EstudianteCalificacion[];
  onEditarNota: (estudiante: EstudianteCalificacion, trimestre: 1 | 2 | 3) => void;
}

export default function TableCalificacionTrimestral({
  data,
  onEditarNota,
}: TableCalificacionTrimestralProps) {

  const calcularPromedio = (
    trim1: number | null,
    trim2: number | null,
    trim3: number | null
  ): string | null => {
    const notas = [trim1, trim2, trim3].filter((n): n is number => n !== null);
    if (notas.length !== 3){
      return null
    } 

    return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1); // 1 decimal es suficiente
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ maxWidth: "96%", mx: "auto", mt: 3, borderRadius: 2 }}>
      <Table aria-label="Tabla de calificaciones por trimestre">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", fontSize: "1rem" }}>
              Estudiante
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", fontSize: "1rem" }}>
              Trimestre 1
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", fontSize: "1rem" }}>
              Trimestre 2
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", fontSize: "1rem" }}>
              Trimestre 3
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", fontSize: "1rem" }}>
              Promedio Final
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="textSecondary">
                  No hay estudiantes registrados para esta materia.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((estudiante) => {
              const promedio = calcularPromedio(estudiante.trim1, estudiante.trim2, estudiante.trim3);

              return (
                <TableRow key={estudiante.estudianteId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                      {estudiante.nombresCompletos}
                    </Typography>
                  </TableCell>

                  {/* Trimestre 1 */}
                  <TableCell align="center">
                    <Box
                      onClick={() => onEditarNota(estudiante, 1)}
                      sx={{
                        cursor: "pointer",
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        bgcolor: estudiante.trim1 !== null ? "#e4e2e2ff" : "#f5f5f5",
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: "#c0c0c0ff", transform: "scale(1.05)" },
                      }}
                    >
                      {estudiante.trim1 !== null ? (
                        <Typography variant="h6" component="span" fontWeight="bold">
                          {estudiante.trim1.toFixed(1)}{" "}
                          <EditIcon fontSize="small" sx={{ verticalAlign: "middle", ml: 0.5 }} />
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Sin nota
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Trimestre 2 */}
                  <TableCell align="center">
                    <Box
                      onClick={() => estudiante.trim1 !== null && onEditarNota(estudiante, 2)}
                      sx={{
                        cursor: estudiante.trim1 !== null ? "pointer" : "not-allowed",
                        opacity: estudiante.trim1 === null ? 0.6 : 1,
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        bgcolor: estudiante.trim2 !== null ? "#e4e2e2ff" : "#f5f5f5",
                        transition: "all 0.2s",
                        "&:hover": estudiante.trim1 !== null ? { bgcolor: "#c0c0c0ff", transform: "scale(1.05)" } : {},
                      }}
                    >
                      {estudiante.trim2 !== null ? (
                        <Typography variant="h6" component="span" fontWeight="bold">
                          {estudiante.trim2.toFixed(1)}{" "}
                          <EditIcon fontSize="small" sx={{ verticalAlign: "middle", ml: 0.5 }} />
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          {estudiante.trim1 === null ? "Bloqueado" : "Sin nota"}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Trimestre 3 */}
                  <TableCell align="center">
                    <Box
                      onClick={() => (estudiante.trim1 !== null && estudiante.trim2 !== null) && onEditarNota(estudiante, 3)}
                      sx={{
                        cursor: (estudiante.trim1 !== null && estudiante.trim2 !== null) ? "pointer" : "not-allowed",
                        opacity: (estudiante.trim1 === null || estudiante.trim2 === null) ? 0.6 : 1,
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        bgcolor: estudiante.trim3 !== null ? "#e4e2e2ff" : "#f5f5f5",
                        transition: "all 0.2s",
                        "&:hover": (estudiante.trim1 !== null && estudiante.trim2 !== null) ? { bgcolor: "#c0c0c0ff", transform: "scale(1.05)" } : {},
                      }}
                    >
                      {estudiante.trim3 !== null ? (
                        <Typography variant="h6" component="span" fontWeight="bold">
                          {estudiante.trim3.toFixed(1)}{" "}
                          <EditIcon fontSize="small" sx={{ verticalAlign: "middle", ml: 0.5 }} />
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          {estudiante.trim1 === null || estudiante.trim2 === null ? "Bloqueado" : "Sin nota"}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Promedio Final */}
                  <TableCell align="center">
                    {promedio !== null ? (
                      <Chip
                        label={promedio}
                        color={Number(promedio) >= 51 ? "success" : "error"}
                        size="medium"
                        sx={{ fontWeight: "bold", minWidth: 70 }}
                      />
                    ) : (
                      <Typography color="textSecondary" variant="body1">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}