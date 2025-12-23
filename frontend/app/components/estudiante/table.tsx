"use client";

import React from "react";
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
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Phone,
  Email,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { useState, useMemo } from "react";
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
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [openEditPadre, setOpenEditPadre] = useState(false);
  const [selectedPadre, setSelectedPadre] = useState<any>(null);
  const [openEditEstudiante, setOpenEditEstudiante] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<any>(null);

  // Estados para ordenamiento
  const [sortBy, setSortBy] = useState<"nombre" | "apellido" | "ci" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { rol } = getAuthData();

  const toggleRow = (id: number) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isRowOpen = (id: number) => openRows.includes(id);

  // Función para alternar orden
  const toggleSort = (field: "nombre" | "apellido" | "ci") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Ícono según estado de orden
  const getSortIcon = (field: "nombre" | "apellido" | "ci") => {
    if (sortBy !== field) return <SortIcon fontSize="small" />;
    return sortOrder === "asc" ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  // Ordenamiento real con useMemo
  const estudiantesOrdenados = useMemo(() => {
    if (!sortBy) return estudiantes;

    return [...estudiantes].sort((a, b) => {
      let valA: string = "";
      let valB: string = "";

      if (sortBy === "nombre") {
        valA = a.estudiante.nombres.toLowerCase();
        valB = b.estudiante.nombres.toLowerCase();
      } else if (sortBy === "apellido") {
        valA = a.estudiante.apellidoPat.toLowerCase();
        valB = b.estudiante.apellidoPat.toLowerCase();
        if (valA === valB) {
          valA = (a.estudiante.apellidoMat || "").toLowerCase();
          valB = (b.estudiante.apellidoMat || "").toLowerCase();
        }
      } else if (sortBy === "ci") {
        valA = a.estudiante.identificacion;
        valB = b.estudiante.identificacion;
        return sortOrder === "asc"
          ? valA.localeCompare(valB, undefined, { numeric: true })
          : valB.localeCompare(valA, undefined, { numeric: true });
      }

      const comparacion = valA.localeCompare(valB);
      return sortOrder === "asc" ? comparacion : -comparacion;
    });
  }, [estudiantes, sortBy, sortOrder]);

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
      case "padre": return "primary";
      case "madre": return "secondary";
      case "tutor": return "info";
      case "abuelo":
      case "abuela": return "warning";
      case "hermano":
      case "hermana": return "success";
      default: return "default";
    }
  };

  const getRelacionIcon = (relacion: string) => {
    switch (relacion.toLowerCase()) {
      case "padre": return "👨";
      case "madre": return "👩";
      case "tutor": return "👤";
      case "abuelo": return "👴";
      case "abuela": return "👵";
      case "hermano": return "👦";
      case "hermana": return "👧";
      default: return "👥";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return "N/A";
    try {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return `${edad} años`;
    } catch {
      return "N/A";
    }
  };

  return (
    <>
      {/* Botones de ordenamiento */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight="medium">
          Ordenar por:
        </Typography>

        <Button
          variant={sortBy === "nombre" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("nombre")}
          onClick={() => toggleSort("nombre")}
          sx={{ textTransform: "none" }}
        >
          Nombre
        </Button>

        <Button
          variant={sortBy === "apellido" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("apellido")}
          onClick={() => toggleSort("apellido")}
          sx={{ textTransform: "none" }}
        >
          Apellido
        </Button>

        <Button
          variant={sortBy === "ci" ? "contained" : "outlined"}
          size="small"
          startIcon={getSortIcon("ci")}
          onClick={() => toggleSort("ci")}
          sx={{ textTransform: "none" }}
        >
          CI
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          Total: {estudiantes.length} estudiante{estudiantes.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell width="50px" />
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estudiante</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CI</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tutores</TableCell>
              {rol !== "Cajero" && rol !== "Docente" && (
                <TableCell width="250px" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {estudiantesOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={rol !== "Cajero" && rol !== "Docente" ? 6 : 5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay estudiantes registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              estudiantesOrdenados.map((e) => {
                const estudianteFullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat || ""}`.trim();
                const isOpen = isRowOpen(e.estudiante.id);

                return (
                  <React.Fragment key={e.estudiante.id}>
                    {/* Fila principal */}
                    <TableRow
                      sx={{
                        "&:hover": { backgroundColor: "action.hover" },
                        backgroundColor: isOpen ? "action.selected" : "inherit",
                      }}
                    >
                      <TableCell>
                        <IconButton size="small" onClick={() => toggleRow(e.estudiante.id)}>
                          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {e.estudiante.nombres} {e.estudiante.apellidoPat}
                          </Typography>
                          {e.estudiante.apellidoMat && (
                            <Typography variant="caption" color="text.secondary">
                              {e.estudiante.apellidoMat}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {e.estudiante.identificacion}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {e.estudiante.correo || "Sin correo"}
                          </Typography>
                          {e.estudiante.correo_institucional && (
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                              {e.estudiante.correo_institucional}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        {e.tutores.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Sin tutores
                          </Typography>
                        ) : (
                          <Box>
                            {e.tutores.length <= 3 ? (
                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                {e.tutores.map((tutor) => (
                                  <Tooltip key={tutor.id} title={`${tutor.nombres} ${tutor.apellidoPat} (${tutor.relacion})`}>
                                    <Chip
                                      size="small"
                                      label={`${tutor.nombres.split(" ")[0]} ${tutor.apellidoPat.charAt(0)}.`}
                                      color={getRelacionColor(tutor.relacion)}
                                      variant="outlined"
                                      sx={{ maxWidth: 120 }}
                                    />
                                  </Tooltip>
                                ))}
                              </Box>
                            ) : (
                              <Tooltip title={e.tutores.map((t) => `${t.nombres} ${t.apellidoPat} (${t.relacion})`).join(", ")}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <AvatarGroup max={3}>
                                    {e.tutores.slice(0, 3).map((tutor) => (
                                      <Avatar
                                        key={tutor.id}
                                        sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                                      >
                                        {tutor.nombres.charAt(0)}
                                      </Avatar>
                                    ))}
                                  </AvatarGroup>
                                  <Typography variant="caption" color="text.secondary">
                                    +{e.tutores.length - 3} más
                                  </Typography>
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </TableCell>

                      {rol !== "Cajero" && rol !== "Docente" && (
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" gap={1}>
                              <Boton
                                label="Editar"
                                size="small"
                                color="warning"
                                onClick={() => {
                                  setSelectedEstudiante(e.estudiante);
                                  setOpenEditEstudiante(true);
                                }}
                              />
                              <Boton
                                label="Eliminar"
                                size="small"
                                color="error"
                                onClick={() => {
                                  if (confirm(`¿Seguro que deseas eliminar al estudiante ${estudianteFullName}?`)) {
                                    handleEliminarEstudiante(e.estudiante.id);
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Fila expandible */}
                  <TableRow key={`expand-${e.estudiante.id}`}>
                    <TableCell 
                      colSpan={rol !== "Cajero" && rol !== "Docente" ? 7 : 6} 
                      sx={{ 
                        p: 0, 
                        borderBottom: isOpen ? 1 : 0, 
                        borderColor: 'divider',
                        backgroundColor: isOpen ? 'background.default' : 'transparent'
                      }}
                    >
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box p={3}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                            <Box width="100%">
                              <Typography variant="h6" gutterBottom color="primary">
                                👤 Información del Estudiante
                              </Typography>
                              
                              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap={3}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Nombre Completo
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {estudianteFullName}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    CI / Identificación
                                  </Typography>
                                  <Typography variant="body1" fontFamily="monospace">
                                    {e.estudiante.identificacion}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Edad
                                  </Typography>
                                  <Typography variant="body1">
                                    {calcularEdad(e.estudiante.fecha_nacimiento)}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Fecha de Nacimiento
                                  </Typography>
                                  <Typography variant="body1">
                                    {formatDate(e.estudiante.fecha_nacimiento)}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Sexo
                                  </Typography>
                                  <Typography variant="body1" textTransform="capitalize">
                                    {e.estudiante.sexo}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Nacionalidad
                                  </Typography>
                                  <Typography variant="body1">
                                    {e.estudiante.nacionalidad}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Correo Personal
                                  </Typography>
                                  <Typography variant="body1">
                                    {e.estudiante.correo || "No especificado"}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Correo Institucional
                                  </Typography>
                                  <Typography variant="body1">
                                    {e.estudiante.correo_institucional}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    RUDE
                                  </Typography>
                                  <Typography variant="body1" fontFamily="monospace">
                                    {e.estudiante.rude}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Dirección
                                  </Typography>
                                  <Typography variant="body1">
                                    {e.estudiante.direccion}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Teléfono de Referencia
                                  </Typography>
                                  <Typography variant="body1">
                                    {e.estudiante.telefono_referencia || "No especificado"}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Fecha de Registro
                                  </Typography>
                                  <Typography variant="body1">
                                    {formatDate(e.estudiante.fecha_creacion)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {/* Sección de Tutores */}
                          <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                              Tutor Principal ({e.tutores.length})
                            </Typography>
                            
                            {e.tutores.length === 0 ? (
                              <Box textAlign="center" py={4} sx={{ backgroundColor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                  Este estudiante no tiene tutores asignados
                                </Typography>
                                <Boton
                                  label="Asignar Primer Tutor"
                                  color="primary"
                                  variant="contained"
                                  onClick={() => {
                                    // Lógica para asignar tutor
                                    alert(`Asignar tutor a: ${estudianteFullName}`);
                                  }}
                                />
                              </Box>
                            ) : (
                              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={2}>
                                {e.tutores.map((tutor) => (
                                  <Paper 
                                    key={tutor.id} 
                                    elevation={1} 
                                    sx={{ 
                                      p: 2, 
                                      position: 'relative',
                                      borderLeft: 4,
                                      borderLeftColor: getRelacionColor(tutor.relacion),
                                      '&:hover': { boxShadow: 3 }
                                    }}
                                  >
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                      <Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                          <Typography variant="h6" component="span">
                                            {getRelacionIcon(tutor.relacion)}
                                          </Typography>
                                          <Typography variant="h6">
                                            {tutor.nombres} {tutor.apellidoPat}
                                          </Typography>
                                          <Chip 
                                            label={tutor.relacion}
                                            size="small"
                                            color={getRelacionColor(tutor.relacion)}
                                            sx={{ textTransform: 'capitalize' }}
                                          />
                                        </Box>
                                        
                                        {tutor.apellidoMat && (
                                          <Typography variant="body2" color="text.secondary">
                                            {tutor.apellidoMat}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                    
                                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          Teléfono
                                        </Typography>
                                        <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                                          <Phone fontSize="small" />
                                          {tutor.telefono}
                                        </Typography>
                                      </Box>
                                      
                                      {tutor.correo && (
                                        <Box>
                                          <Typography variant="caption" color="text.secondary" display="block">
                                            Correo
                                          </Typography>
                                          <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                                            <Email fontSize="small" />
                                            {tutor.correo}
                                          </Typography>
                                        </Box>
                                      )}
                                      
                                      {tutor.fechaAsignacion && (
                                        <Box gridColumn="span 2">
                                          <Typography variant="caption" color="text.secondary" display="block">
                                            Fecha de Asignación
                                          </Typography>
                                          <Typography variant="body2">
                                            {formatDate(tutor.fechaAsignacion)}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    
                                    {rol !== "Cajero" && rol !== "Docente" && (
                                      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
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
                                          onClick={() => {
                                            if (confirm(`¿Eliminar permanentemente a ${tutor.nombres} ${tutor.apellidoPat}?`)) {
                                              handleEliminarPadre(tutor.id);
                                            }
                                          }}
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
                </React.Fragment>
              );
            })
          )}
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
          estudiante={selectedEstudiante}
          onClose={() => setOpenEditEstudiante(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </TableContainer>
    </>
  );
}