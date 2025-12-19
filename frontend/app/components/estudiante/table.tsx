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
  Chip,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  Phone,
  Email,
} from "@mui/icons-material";
import { useState } from "react";
import { api } from "@/app/lib/api";
import EditPadreDialog from "../padre/EditPadreDialog";
import EditEstudianteDialog from "./EditEstudianteDialog";
import { getAuthData } from "@/app/lib/auth";
import { Boton } from "../botones/botonNav";

interface EstudianteConTutores {
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
  tutores: Array<{
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    telefono: string;
    correo?: string;
    estado: string;
    relacion: string;
    fechaAsignacion?: string;
  }>;
}

interface Props {
  estudiantes: EstudianteConTutores[];
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


  const getRelacionColor = (relacion: string) => {
    switch (relacion.toLowerCase()) {
      case 'padre': return 'primary';
      case 'madre': return 'secondary';
      case 'tutor': return 'info';
      case 'abuelo': return 'warning';
      case 'abuela': return 'warning';
      case 'hermano': return 'success';
      case 'hermana': return 'success';
      default: return 'default';
    }
  };

  const getRelacionIcon = (relacion: string) => {
    switch (relacion.toLowerCase()) {
      case 'padre': return '👨';
      case 'madre': return '👩';
      case 'tutor': return '👤';
      case 'abuelo': return '👴';
      case 'abuela': return '👵';
      case 'hermano': return '👦';
      case 'hermana': return '👧';
      default: return '👥';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="50px" />
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Estudiante</strong></TableCell>
            <TableCell><strong>CI</strong></TableCell>
            <TableCell><strong>Correo</strong></TableCell>
            <TableCell><strong>Tutores ({estudiantes.reduce((acc, e) => acc + e.tutores.length, 0)})</strong></TableCell>
            {/* <TableCell><strong>Estado</strong></TableCell> */}
            {rol !== "Cajero" && rol !== "Docente" && (
              <TableCell width="250px"><strong>Acciones</strong></TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {estudiantes.map((e) => {
            const estudianteFullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat || ""}`;

            return (
              <>
                <TableRow key={e.estudiante.id}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setOpenRow(openRow === e.estudiante.id ? null : e.estudiante.id)
                      }
                    >
                      {openRow === e.estudiante.id ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>

                  <TableCell>{e.estudiante.id}</TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {e.estudiante.nombres} {e.estudiante.apellidoPat}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {e.estudiante.apellidoMat || "Sin ap. materno"}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>{e.estudiante.identificacion}</TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{e.estudiante.correo}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {e.estudiante.correo_institucional}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {e.tutores.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        Sin tutores
                      </Typography>
                    ) : (
                      <Box>
                        {/* Mostrar primer tutor principal */}
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {e.tutores[0].nombres} {e.tutores[0].apellidoPat}
                          </Typography>
                          <Chip 
                            label={e.tutores[0].relacion}
                            size="small"
                            color={getRelacionColor(e.tutores[0].relacion)}
                            variant="outlined"
                          />
                        </Box>
                        
                        {/* Indicador de tutores adicionales */}
                        {e.tutores.length > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            + {e.tutores.length - 1} tutor(es) más
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>
                  
                  {/* <TableCell>
                    <Chip 
                      label={e.estudiante.estado}
                      size="small"
                      color={e.estudiante.estado === 'activo' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell> */}
                  
                  {rol !== "Cajero" && rol !== "Docente" && (
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" gap={1}>
                          <Boton
                            label="Editar"
                            size="small"
                            color="warning"
                            onClick={() => {
                              setSelectedEstudiante(e);
                              setOpenEditEstudiante(true);
                            }}
                            
                          />
                          <Boton
                            label="Eliminar"
                            size="small"
                            color="error"
                            onClick={() => handleEliminarEstudiante(e.estudiante.id)}
                            
                          />
                        </Box>

                      </Box>
                    </TableCell>
                  )}
                </TableRow>

                {/* Fila expandible */}
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0, bgcolor: 'background.default' }}>
                    <Collapse
                      in={openRow === e.estudiante.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box p={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              Información del Estudiante
                            </Typography>
                            
                            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Nombre Completo</Typography>
                                <Typography>{estudianteFullName}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">CI</Typography>
                                <Typography>{e.estudiante.identificacion}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">RUDE</Typography>
                                <Typography>{e.estudiante.rude}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Correo Personal</Typography>
                                <Typography>{e.estudiante.correo || "No especificado"}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Correo Institucional</Typography>
                                <Typography>{e.estudiante.correo_institucional}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Dirección</Typography>
                                <Typography>{e.estudiante.direccion}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
                                <Typography>{e.estudiante.telefono_referencia || "No especificado"}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Fecha Nacimiento</Typography>
                                <Typography>{new Date(e.estudiante.fecha_nacimiento).toLocaleDateString()}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Sexo</Typography>
                                <Typography>{e.estudiante.sexo}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Nacionalidad</Typography>
                                <Typography>{e.estudiante.nacionalidad}</Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                                <Chip 
                                  label={e.estudiante.estado}
                                  size="small"
                                  color={e.estudiante.estado === 'activo' ? 'success' : 'error'}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        {/* Sección de Tutores */}
                        <Box mt={4}>
                          <Typography variant="h6" gutterBottom>
                            Tutores ({e.tutores.length})
                          </Typography>
                          
                          {e.tutores.length === 0 ? (
                            <Box textAlign="center" py={3}>
                              <Typography variant="body1" color="text.secondary">
                                Este estudiante no tiene tutores asignados
                              </Typography>
                              <Boton
                                label="Asignar Primer Tutor"
                                color="primary"
                                onClick={() => {
                                }}
                                
                              />
                            </Box>
                          ) : (
                            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
                              {e.tutores.map((tutor, index) => (
                                <Paper key={tutor.id} elevation={1} sx={{ p: 2, position: 'relative' }}>
                                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Typography variant="h6">
                                          {getRelacionIcon(tutor.relacion)} {tutor.nombres} {tutor.apellidoPat}
                                        </Typography>
                                        <Chip 
                                          label={tutor.relacion}
                                          size="small"
                                          color={getRelacionColor(tutor.relacion)}
                                        />
                                      </Box>
                                      
                                      <Typography variant="body2" color="text.secondary">
                                        {tutor.apellidoMat || "Sin ap. materno"}
                                      </Typography>
                                      
                                      <Box mt={1}>
                                        <Typography variant="body2">
                                          <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                          {tutor.telefono}
                                        </Typography>
                                        
                                        {tutor.correo && (
                                          <Typography variant="body2">
                                            <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                            {tutor.correo}
                                          </Typography>
                                        )}
                                        
                                        {tutor.fechaAsignacion && (
                                          <Typography variant="caption" color="text.secondary">
                                            Asignado: {new Date(tutor.fechaAsignacion).toLocaleDateString()}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                    
                                  </Box>
                                  
                                  {rol !== "Cajero" && rol !== "Docente" && (
                                    <Box mt={2} display="flex" gap={1}>
                                      <Boton
                                        label="Editar"
                                        size="small"
                                        color="warning"
                                        onClick={() => {
                                          setSelectedPadre(tutor);
                                          setOpenEditPadre(true);
                                        }}
                                      />
                                      
                                      <Boton
                                        label="Eliminar"
                                        size="small"
                                        color="error"
                                        onClick={() => handleEliminarPadre(tutor.id)}
                                      />
                                      
                                    </Box>
                                  )}
                                </Paper>
                              ))}
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

      {/* MODALES */}
      {selectedPadre && (
        <EditPadreDialog
          open={openEditPadre}
          padre={selectedPadre}
          onClose={() => setOpenEditPadre(false)}
          onUpdated={() => window.location.reload()}
        />
      )}

      {selectedEstudiante && (
        <EditEstudianteDialog
          open={openEditEstudiante}
          estudiante={selectedEstudiante.estudiante}
          onClose={() => setOpenEditEstudiante(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </TableContainer>
  );
}