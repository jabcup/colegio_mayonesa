"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useState } from "react";
import { api } from "@/app/lib/api";
import EditPadreDialog from "../padre/EditPadreDialog";
import EditEstudianteDialog from "./EditEstudianteDialog";
import { getAuthData } from "@/app/lib/auth";
import { Boton } from "../botones/botonNav";

interface EstudianteFull {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    identificacion: string;
    correo: string;
    correo_institucional: string;
    rude: string;
    direccion: string;
    telefono_referencia: string;
    fecha_nacimiento: string;
    sexo: string;
    nacionalidad: string;
    fecha_creacion: string;
    estado: string;
  };
  tutor: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    telefono: string;
    correo?: string;
    estado: string;
  };
  relacion: string;
  fecha_creacion: string;
  estado: string;
}

interface Props {
  estudiantes: EstudianteFull[];
}

export default function TableEstudiante({ estudiantes }: Props) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [openEditPadre, setOpenEditPadre] = useState(false);
  const [selectedPadre, setSelectedPadre] = useState<any>(null);

  const [openEditEstudiante, setOpenEditEstudiante] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<any>(null);

  const { rol, idPersonal } = getAuthData();

  const handleEliminarPadre = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este tutor?")) return;

    try {
      await api.delete(`/padres/eliminar/${id}`);
      alert("Tutor eliminado correctamente");
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al eliminar tutor");
    }
  };

  const handleEliminarEstudiante = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este estudiante?")) return;

    try {
      await api.delete(`/estudiante/eliminar/${id}`);
      alert("Estudiante eliminado correctamente");
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al eliminar estudiante");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Nombre Completo</strong></TableCell>
            <TableCell><strong>CI</strong></TableCell>
            <TableCell><strong>Correo</strong></TableCell>
            <TableCell><strong>Tutor</strong></TableCell>
            {/* <TableCell><strong>Estado</strong></TableCell> */}
            {rol !== "Cajero" && rol !== "Docente" && (
            <TableCell><strong>Acciones</strong></TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {estudiantes.map((e) => {
            const fullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat}`;
            const tutorName = `${e.tutor.nombres} ${e.tutor.apellidoPat} ${e.tutor.apellidoMat}`;

            return (
              <>
                {/* FILA PRINCIPAL */}
                <TableRow key={e.id}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setOpenRow(openRow === e.id ? null : e.id)
                      }
                    >
                      {openRow === e.id ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>

                  <TableCell>{e.id}</TableCell>
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{e.estudiante.identificacion}</TableCell>
                  <TableCell>{e.estudiante.correo}</TableCell>
                  <TableCell>{tutorName}</TableCell>
                  {/* <TableCell>{e.estudiante.estado}</TableCell> */}
                  {rol !== "Cajero" && rol !== "Docente" && (
                  <TableCell>
                    <Boton
                    label="Editar Estudiante"
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedEstudiante(e);
                        setOpenEditEstudiante(true);
                      }}
                      className="mr-2"
                    />

                    <Boton
                    label="Eliminar Estudiante"
                      size="small"
                      color = "error"
                      onClick={() =>
                        handleEliminarEstudiante(e.estudiante.id)
                      }
                      className="ml-2"
                    />
                     
                  </TableCell>
                  )}
                </TableRow>

                {/* FILA EXPANDIBLE */}
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0 }}>
                    <Collapse
                      in={openRow === e.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={2}>
                        <Typography variant="h6">
                          Información del Estudiante
                        </Typography>

                        <Typography>
                          <b>Correo Institucional:</b>{" "}
                          {e.estudiante.correo_institucional}
                        </Typography>
                        <Typography>
                          <b>RUDE:</b> {e.estudiante.rude}
                        </Typography>
                        <Typography>
                          <b>Dirección:</b> {e.estudiante.direccion}
                        </Typography>
                        <Typography>
                          <b>Teléfono:</b>{" "}
                          {e.estudiante.telefono_referencia}
                        </Typography>
                        <Typography>
                          <b>Fecha de Nacimiento:</b>{" "}
                          {e.estudiante.fecha_nacimiento}
                        </Typography>
                        <Typography>
                          <b>Sexo:</b> {e.estudiante.sexo}
                        </Typography>
                        <Typography>
                          <b>Nacionalidad:</b> {e.estudiante.nacionalidad}
                        </Typography>

                        <Box mt={2}>
                          <Typography variant="h6">
                            Tutor
                          </Typography>

                          <Typography>
                            <b>Nombre:</b> {tutorName}
                          </Typography>
                          <Typography>
                            <b>Teléfono:</b> {e.tutor.telefono}
                          </Typography>
                          <Typography>
                            <b>Relación:</b> {e.relacion}
                          </Typography>
                          {/* <Typography>
                            <b>Estado Tutor:</b> {e.tutor.estado}
                          </Typography> */}

                          {rol !== "Cajero" && rol !== "Docente" && (
                          <Box mt={1} display="flex" gap={1}>
                            <Boton
                            label="Editar Tutor"
                              size="small"
                              color="primary"
                              onClick={() => {
                                setSelectedPadre(e.tutor);
                                setOpenEditPadre(true);
                              }}
                              className="mr-2"
                            />
                            
                            <Boton
                            label="Eliminar Tutor"
                              size="small"
                              color="error"
                              onClick={() =>
                                handleEliminarPadre(e.tutor.id)
                              }
                            />
                              
                          </Box>
                          )}
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>

      {/* MODAL EDITAR PADRE */}
      {selectedPadre && (
        <EditPadreDialog
          open={openEditPadre}
          padre={selectedPadre}
          onClose={() => setOpenEditPadre(false)}
          onUpdated={() => window.location.reload()}
        />
      )}

      {/* MODAL EDITAR ESTUDIANTE */}
      {selectedEstudiante && (
        <EditEstudianteDialog
          open={openEditEstudiante}
          estudiante={selectedEstudiante}
          onClose={() => setOpenEditEstudiante(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </TableContainer>
  );
}
