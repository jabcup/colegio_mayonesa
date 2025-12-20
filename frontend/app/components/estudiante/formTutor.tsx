"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormHelperText,
  MenuItem,
  Alert,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat?: string;
  identificacion: string;
  tieneTutorActivo?: boolean;
}

interface Padre {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat?: string;
  telefono: string;
  estado: string;
}

interface FormErrors {
  idEstudiante?: string;
  idTutor?: string;
  relacion?: string;
}

export default function FormAsignarPadreEstudiante({ open, onClose, onSuccess }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [padres, setPadres] = useState<Padre[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  const [form, setForm] = useState({
    idEstudiante: "",
    idTutor: "",
    relacion: "padre",
  });

  const [filtros, setFiltros] = useState({
    buscarEstudiante: "",
    buscarTutor: "",
  });

  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
  const [padresFiltrados, setPadresFiltrados] = useState<Padre[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [infoMessage, setInfoMessage] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [tutorSeleccionado, setTutorSeleccionado] = useState<Padre | null>(null);

  useEffect(() => {
    if (open) {
      cargarDatos();
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    const termino = filtros.buscarEstudiante.toLowerCase();
    const filtrados = estudiantes.filter(estudiante => {
      const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat || ""}`.toLowerCase();
      const ci = estudiante.identificacion.toLowerCase();
      return nombreCompleto.includes(termino) || ci.includes(termino);
    });
    setEstudiantesFiltrados(filtrados);
  }, [filtros.buscarEstudiante, estudiantes]);

  useEffect(() => {
    const termino = filtros.buscarTutor.toLowerCase();
    const filtrados = padres.filter(padre => {
      const nombreCompleto = `${padre.nombres} ${padre.apellidoPat} ${padre.apellidoMat || ""}`.toLowerCase();
      const telefono = padre.telefono.toLowerCase();
      return (nombreCompleto.includes(termino) || telefono.includes(termino)) && padre.estado === 'activo';
    });
    setPadresFiltrados(filtrados);
  }, [filtros.buscarTutor, padres]);

  useEffect(() => {
    if (form.idEstudiante && estudiantes.length > 0) {
      const estudiante = estudiantes.find(e => e.id === Number(form.idEstudiante));
      setEstudianteSeleccionado(estudiante || null);
      
      if (estudiante?.tieneTutorActivo) {
        setInfoMessage("Este estudiante ya tiene un tutor activo. La nueva asignación se sumará al Estudiante.");
      } else {
        setInfoMessage("");
      }
    } else {
      setEstudianteSeleccionado(null);
      setInfoMessage("");
    }
  }, [form.idEstudiante, estudiantes]);

  useEffect(() => {
    if (form.idTutor && padres.length > 0) {
      const tutor = padres.find(p => p.id === Number(form.idTutor));
      setTutorSeleccionado(tutor || null);
    } else {
      setTutorSeleccionado(null);
    }
  }, [form.idTutor, padres]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [eRes, pRes, aRes] = await Promise.all([
        api.get("/estudiante/MostrarEstudiantes"),
        api.get("/padres/MostrarPadres"),
        api.get("/padre-estudiante/todos")
      ]);
      
      const estudiantesData: Estudiante[] = eRes.data || [];
      const asignaciones = aRes.data || [];
      
      const estudiantesConTutor = asignaciones
        .filter((a: any) => a.estado === 'activo')
        .map((a: any) => a.estudiante.id);
      
      const estudiantesConInfo = estudiantesData.map(estudiante => ({
        ...estudiante,
        tieneTutorActivo: estudiantesConTutor.includes(estudiante.id)
      }));
      
      setEstudiantes(estudiantesConInfo);
      setPadres(pRes.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      idEstudiante: "",
      idTutor: "",
      relacion: "padre",
    });
    setFiltros({
      buscarEstudiante: "",
      buscarTutor: "",
    });
    setErrors({});
    setInfoMessage("");
    setEstudianteSeleccionado(null);
    setTutorSeleccionado(null);
  };

  const handleBuscarEstudianteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros(prev => ({ ...prev, buscarEstudiante: e.target.value }));
  };

  const handleBuscarTutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros(prev => ({ ...prev, buscarTutor: e.target.value }));
  };

  const handleSeleccionarEstudiante = (estudiante: Estudiante) => {
    setForm(prev => ({ ...prev, idEstudiante: estudiante.id.toString() }));
    setFiltros(prev => ({ ...prev, buscarEstudiante: "" }));
    
    if (errors.idEstudiante) {
      setErrors(prev => ({ ...prev, idEstudiante: undefined }));
    }
  };

  const handleSeleccionarTutor = (tutor: Padre) => {
    setForm(prev => ({ ...prev, idTutor: tutor.id.toString() }));
    setFiltros(prev => ({ ...prev, buscarTutor: "" }));
    
    if (errors.idTutor) {
      setErrors(prev => ({ ...prev, idTutor: undefined }));
    }
  };

  const handleRelacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, relacion: e.target.value }));
    
    if (errors.relacion) {
      setErrors(prev => ({ ...prev, relacion: undefined }));
    }
  };

  const handleQuitarEstudiante = () => {
    setForm(prev => ({ ...prev, idEstudiante: "" }));
    setEstudianteSeleccionado(null);
    setInfoMessage("");
  };

  const handleQuitarTutor = () => {
    setForm(prev => ({ ...prev, idTutor: "" }));
    setTutorSeleccionado(null);
  };

  const validarAsignacionUnica = (idEstudiante: number, idTutor: number): boolean => {
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.idEstudiante) {
      newErrors.idEstudiante = "Debe seleccionar un estudiante";
    }
    
    if (!form.idTutor) {
      newErrors.idTutor = "Debe seleccionar un tutor";
    }
    
    if (!form.relacion) {
      newErrors.relacion = "Debe seleccionar una relación";
    }
    
    if (form.idEstudiante && form.idTutor) {
      if (!validarAsignacionUnica(Number(form.idEstudiante), Number(form.idTutor))) {
        newErrors.idTutor = "Este tutor ya está asignado a este estudiante";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const payload = {
        idEstudiante: Number(form.idEstudiante),
        idTutor: Number(form.idTutor),
        relacion: form.relacion,
      };

      await api.post("/padre-estudiante/asignarPadreEstudiante", payload);
      
      alert(
        `✅ Tutor asignado exitosamente\n\n` +
        `Estudiante: ${estudianteSeleccionado?.nombres} ${estudianteSeleccionado?.apellidoPat}\n` +
        `Tutor: ${tutorSeleccionado?.nombres} ${tutorSeleccionado?.apellidoPat}\n` +
        `Relación: ${form.relacion}`
      );
      
      onSuccess();
      resetForm();
      onClose();
      
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al asignar tutor";
      alert(`❌ ${message}`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar Tutor a Estudiante</DialogTitle>

      <DialogContent>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {infoMessage && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {infoMessage}
              </Alert>
            )}

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              1. Seleccionar Estudiante *
            </Typography>

            {estudianteSeleccionado ? (
              <Box sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'success.light', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'success.main'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {estudianteSeleccionado.nombres} {estudianteSeleccionado.apellidoPat} {estudianteSeleccionado.apellidoMat || ""}
                    </Typography>
                    <Typography variant="body2">
                      CI: {estudianteSeleccionado.identificacion}
                    </Typography>
                    {estudianteSeleccionado.tieneTutorActivo && (
                      <Typography variant="caption" color="warning">
                        Ya tiene tutor activo
                      </Typography>
                    )}
                  </Box>
                  <IconButton size="small" onClick={handleQuitarEstudiante} color="error">
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <>
                <TextField
                  label="Buscar estudiante por nombre, apellido o CI"
                  fullWidth
                  value={filtros.buscarEstudiante}
                  onChange={handleBuscarEstudianteChange}
                  error={!!errors.idEstudiante}
                  helperText={errors.idEstudiante}
                  margin="normal"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  placeholder="Ej: Juan Pérez o 12345678"
                />

                {filtros.buscarEstudiante && estudiantesFiltrados.length > 0 && (
                  <List sx={{ 
                    maxHeight: 200, 
                    overflow: 'auto', 
                    border: 1, 
                    borderColor: 'divider',
                    borderRadius: 1,
                    mt: 1,
                    mb: 2
                  }}>
                    {estudiantesFiltrados.map((estudiante) => (
                      <div key={estudiante.id}>
                        <ListItem 
                          button 
                          onClick={() => handleSeleccionarEstudiante(estudiante)}
                          sx={{ 
                            '&:hover': { bgcolor: 'action.hover' },
                            bgcolor: estudiante.tieneTutorActivo ? 'warning.light' : 'inherit'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body1">
                                {estudiante.nombres} {estudiante.apellidoPat} {estudiante.apellidoMat || ""}
                                {estudiante.tieneTutorActivo && (
                                  <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                                    (Tiene tutor)
                                  </Typography>
                                )}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                CI: {estudiante.identificacion}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </div>
                    ))}
                  </List>
                )}

                {filtros.buscarEstudiante && estudiantesFiltrados.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    No se encontraron estudiantes
                  </Typography>
                )}
              </>
            )}

            {estudianteSeleccionado && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                  2. Seleccionar Tutor (Padre) *
                </Typography>

                {tutorSeleccionado ? (
                  <Box sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: 'info.light', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'info.main'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {tutorSeleccionado.nombres} {tutorSeleccionado.apellidoPat} {tutorSeleccionado.apellidoMat || ""}
                        </Typography>
                        <Typography variant="body2">
                          Tel: {tutorSeleccionado.telefono}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={handleQuitarTutor} color="error">
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <TextField
                      label="Buscar tutor por nombre, apellido o teléfono"
                      fullWidth
                      value={filtros.buscarTutor}
                      onChange={handleBuscarTutorChange}
                      error={!!errors.idTutor}
                      helperText={errors.idTutor}
                      margin="normal"
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                      placeholder="Ej: Carlos López o 77889900"
                    />

                    {filtros.buscarTutor && padresFiltrados.length > 0 && (
                      <List sx={{ 
                        maxHeight: 200, 
                        overflow: 'auto', 
                        border: 1, 
                        borderColor: 'divider',
                        borderRadius: 1,
                        mt: 1,
                        mb: 2
                      }}>
                        {padresFiltrados.map((tutor) => (
                          <div key={tutor.id}>
                            <ListItem 
                              button 
                              onClick={() => handleSeleccionarTutor(tutor)}
                              sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="body1">
                                    {tutor.nombres} {tutor.apellidoPat} {tutor.apellidoMat || ""}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    Tel: {tutor.telefono}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <Divider />
                          </div>
                        ))}
                      </List>
                    )}

                    {filtros.buscarTutor && padresFiltrados.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                        No se encontraron tutores
                      </Typography>
                    )}

                    {padres.length === 0 && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        No hay tutores registrados. Primero debe registrar un padre/tutor.
                      </Alert>
                    )}
                  </>
                )}

                {tutorSeleccionado && (
                  <>
                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                      3. Seleccionar Relación *
                    </Typography>
                    
                    <TextField
                      select
                      label="Tipo de relación"
                      fullWidth
                      value={form.relacion}
                      onChange={handleRelacionChange}
                      error={!!errors.relacion}
                      helperText={errors.relacion}
                      margin="normal"
                    >
                      <MenuItem value="padre">Padre</MenuItem>
                      <MenuItem value="madre">Madre</MenuItem>
                      <MenuItem value="tutor">Tutor</MenuItem>
                      <MenuItem value="abuelo">Abuelo</MenuItem>
                      <MenuItem value="abuela">Abuela</MenuItem>
                      <MenuItem value="hermano">Hermano</MenuItem>
                      <MenuItem value="hermana">Hermana</MenuItem>
                      <MenuItem value="tío">Tío</MenuItem>
                      <MenuItem value="tía">Tía</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </TextField>
                  </>
                )}
              </>
            )}

            <FormHelperText sx={{ mt: 3, color: 'text.secondary' }}>
              * Campos obligatorios. Busque y seleccione en cada paso.
            </FormHelperText>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loadingSubmit}>
          Cancelar
      </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading || loadingSubmit || !estudianteSeleccionado || !tutorSeleccionado}
          color="primary"
        >
          {loadingSubmit ? "Asignando..." : "Asignar Tutor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}