"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import { api } from "@/app/lib/api";

interface Estudiante {
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
}

interface Props {
  open: boolean;
  estudiante: Estudiante | null;
  onClose: () => void;
  onUpdated: () => void;
}

// Opciones de extensión para CI
const extensionOptions = [
  { value: '', label: 'Sin ext.' },
  { value: 'LP', label: 'LP' },
  { value: 'SC', label: 'SC' },
  { value: 'CB', label: 'CB' },
  { value: 'CH', label: 'CH' },
  { value: 'PT', label: 'PT' },
  { value: 'TJ', label: 'TJ' },
  { value: 'OR', label: 'OR' },
  { value: 'BE', label: 'BE' },
  { value: 'PD', label: 'PD' },
];

export default function EditEstudianteDialog({
  open,
  estudiante,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [verificandoCI, setVerificandoCI] = useState(false);

  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "",
    ciNumero: "",
    ciExtension: "",
    correo: "",
    direccion: "",
    telefono_referencia: "",
    fecha_nacimiento: "",
    sexo: "",
    nacionalidad: "",
  });

  const [errors, setErrors] = useState<{
    nombres?: string;
    apellidoPat?: string;
    apellidoMat?: string;
    ciNumero?: string;
    correo?: string;
    telefono_referencia?: string;
    fecha_nacimiento?: string;
  }>({});

  // Cambia este dominio por el de tu institución
  const DOMINIO_INSTITUCIONAL = "colegio.edu.bo";

  // Función para extraer solo el número del CI
  const extraerNumeroCI = (identificacion: string): string => {
    return identificacion.replace(/\s+[A-Za-z]{1,2}$/, '').trim();
  };

  // Función para extraer la extensión del CI
  const extraerExtensionCI = (identificacion: string): string => {
    const match = identificacion.match(/([A-Za-z]{1,2})$/);
    return match ? match[0] : '';
  };

  useEffect(() => {
    if (estudiante) {
      const ciNumero = extraerNumeroCI(estudiante.identificacion);
      const ciExtension = extraerExtensionCI(estudiante.identificacion);
      
      setForm({
        nombres: estudiante.nombres || "",
        apellidoPat: estudiante.apellidoPat || "",
        apellidoMat: estudiante.apellidoMat || "",
        ciNumero: ciNumero || "",
        ciExtension: ciExtension || "",
        correo: estudiante.correo || "",
        direccion: estudiante.direccion || "",
        telefono_referencia: estudiante.telefono_referencia || "",
        fecha_nacimiento: estudiante.fecha_nacimiento || "",
        sexo: estudiante.sexo || "",
        nacionalidad: estudiante.nacionalidad || "",
      });
      setErrors({});
    }
  }, [estudiante]);

  // Validaciones
  const soloLetrasYEspacios = (texto: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(texto);
  };

  const soloNumeros = (texto: string): boolean => {
    const regex = /^[0-9]*$/;
    return regex.test(texto);
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Formato de correo inválido";
  };

  const validateCI = (ci: string): string => {
    if (!ci.trim()) return "Número de CI es requerido";
    if (!soloNumeros(ci)) return "El número de CI solo puede contener números";
    if (ci.length < 5 || ci.length > 15) return "CI debe tener entre 5 y 15 dígitos";
    return "";
  };

  const validateTelefono = (tel: string): string => {
    if (!tel.trim()) return ""; // Opcional
    if (!soloNumeros(tel)) return "El teléfono solo puede contener números";
    if (tel.length < 7 || tel.length > 15) return "Teléfono debe tener entre 7 y 15 dígitos";
    return "";
  };

  const validateFechaNacimiento = (date: string): string => {
    if (!date) return "Fecha de nacimiento es requerida";

    const birthDate = new Date(date);
    const today = new Date();

    if (birthDate > today) {
      return "La fecha no puede ser futura";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 5) return "El estudiante debe tener al menos 5 años";
    if (age > 18) return "El estudiante no puede tener más de 18 años";

    return "";
  };

  // Función para verificar si un CI ya existe
  const verificarCIUnico = async (ciNumero: string, idEstudianteActual?: number): Promise<boolean> => {
    if (!ciNumero.trim() || ciNumero.length < 5) return true;
    
    try {
      const params = new URLSearchParams({
        ciNumero: ciNumero,
        ...(idEstudianteActual && { idExcluir: idEstudianteActual.toString() })
      });
      
      const response = await api.get(`/estudiante/verificar-ci-unico?${params}`);
      return response.data.esUnico;
    } catch (error: any) {
      console.error('Error verificando CI único:', error);
      return true; // En caso de error, permitir continuar
    }
  };

  // Validar CI único en tiempo real
  const validarCIUnicoEnTiempoReal = async () => {
    if (!form.ciNumero.trim() || form.ciNumero.length < 5) return;
    
    setVerificandoCI(true);
    try {
      const esUnico = await verificarCIUnico(form.ciNumero, estudiante?.id);
      if (!esUnico) {
        setErrors(prev => ({
          ...prev,
          ciNumero: "Este número de CI ya está registrado en el sistema"
        }));
      }
    } catch (error) {
      console.error('Error en validación de CI:', error);
    } finally {
      setVerificandoCI(false);
    }
  };

  // Obtener la identificación completa concatenada
  const getIdentificacionCompleta = () => {
    const ci = form.ciNumero.trim();
    const extension = form.ciExtension.trim();
    
    if (!ci) return "";
    
    return extension ? `${ci} ${extension}` : ci;
  };

  const generarCorreoInstitucional = (): string => {
    if (!form.nombres || !form.ciNumero) {
      return "No disponible hasta completar nombre y CI";
    }
    const primerNombre = form.nombres.trim().split(" ")[0].toLowerCase();
    const ci = form.ciNumero.trim();
    return `${primerNombre}.${ci}@${DOMINIO_INSTITUCIONAL}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Bloquear caracteres no permitidos según el campo
    if (name === "nombres" || name === "apellidoPat" || name === "apellidoMat") {
      if (!soloLetrasYEspacios(value)) {
        return; // No permite números ni símbolos
      }
    }

    if (name === "ciNumero" || name === "telefono_referencia") {
      if (!soloNumeros(value)) {
        return; // Solo permite números
      }
    }

    if (name === "ciNumero") {
      // Solo permitir números para CI
      const soloNumeros = value.replace(/\D/g, '');
      setForm({ ...form, [name]: soloNumeros });
    } else {
      setForm({ ...form, [name]: finalValue });
    }

    // Validación en tiempo real
    let error = "";
    switch (name) {
      case "nombres":
      case "apellidoPat":
        error = value.trim() ? "" : "Campo requerido";
        if (value && !soloLetrasYEspacios(value)) error = "Solo letras y espacios";
        break;
      case "apellidoMat":
        if (value.trim() && !soloLetrasYEspacios(value)) {
          error = "Solo letras y espacios";
        }
        break;
      case "ciNumero":
        error = validateCI(value);
        break;
      case "telefono_referencia":
        error = validateTelefono(value);
        break;
      case "correo":
        error = validateEmail(value);
        break;
      case "fecha_nacimiento":
        error = validateFechaNacimiento(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleExtensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm({ ...form, ciExtension: value });
    
    if (errors.ciNumero) {
      setErrors({ ...errors, ciNumero: "" });
    }
  };

  const handleSubmit = async () => {
    if (!estudiante) return;

    // Validación completa
    const newErrors: any = {};

    if (!form.nombres.trim()) newErrors.nombres = "Requerido";
    else if (!soloLetrasYEspacios(form.nombres)) newErrors.nombres = "Solo letras";

    if (!form.apellidoPat.trim()) newErrors.apellidoPat = "Requerido";
    else if (!soloLetrasYEspacios(form.apellidoPat)) newErrors.apellidoPat = "Solo letras";

    if (form.apellidoMat.trim() && !soloLetrasYEspacios(form.apellidoMat)) {
      newErrors.apellidoMat = "Solo letras";
    }

    // Validar CI
    newErrors.ciNumero = validateCI(form.ciNumero);
    
    // Si el CI es válido numéricamente, verificar unicidad
    if (!newErrors.ciNumero) {
      try {
        const esUnico = await verificarCIUnico(form.ciNumero, estudiante.id);
        if (!esUnico) {
          newErrors.ciNumero = "Este número de CI ya está registrado en el sistema";
        }
      } catch (error) {
        console.error('Error validando unicidad del CI:', error);
        newErrors.ciNumero = "Error al verificar la unicidad del CI";
      }
    }

    newErrors.telefono_referencia = validateTelefono(form.telefono_referencia);
    newErrors.correo = validateEmail(form.correo);
    newErrors.fecha_nacimiento = validateFechaNacimiento(form.fecha_nacimiento);

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "")) {
      alert("Por favor, corrige los errores en el formulario");
      return;
    }

    setLoading(true);
    try {
      // Preparar datos con identificación completa
      const datosParaEnviar = {
        nombres: form.nombres.trim(),
        apellidoPat: form.apellidoPat.trim(),
        apellidoMat: form.apellidoMat.trim(),
        identificacion: getIdentificacionCompleta(),
        correo: form.correo.trim(),
        direccion: form.direccion.trim(),
        telefono_referencia: form.telefono_referencia.trim(),
        fecha_nacimiento: form.fecha_nacimiento,
        sexo: form.sexo,
        nacionalidad: form.nacionalidad,
      };

      await api.put(`/estudiante/editar/${estudiante.id}`, datosParaEnviar);
      alert("Estudiante actualizado exitosamente");
      onUpdated();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.message?.includes('identificacion') || err.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          ciNumero: "Este número de CI ya está registrado en el sistema"
        }));
        alert("Este número de CI ya está registrado en el sistema");
      } else {
        alert(err?.response?.data?.message || "Error al actualizar estudiante");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Estudiante</DialogTitle>

      <DialogContent>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <TextField
              label="Nombres *"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.nombres}
              helperText={errors.nombres || "Solo letras y espacios"}
            />

            <TextField
              label="Apellido Paterno *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat || "Solo letras y espacios"}
            />

            <TextField
              label="Apellido Materno"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat || "Opcional, solo letras"}
            />

            {/* Campo de CI con extensión */}
            <div style={{ margin: "16px 0 8px 0" }}>
              <Typography variant="subtitle2" gutterBottom>
                Cédula de Identidad *
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    label="Número de CI"
                    name="ciNumero"
                    value={form.ciNumero}
                    onChange={handleChange}
                    onBlur={validarCIUnicoEnTiempoReal}
                    fullWidth
                    error={!!errors.ciNumero}
                    helperText={errors.ciNumero || "Solo números (5-15 dígitos)"}
                    disabled={verificandoCI || loading}
                    inputProps={{ 
                      maxLength: 15,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    InputProps={{
                      endAdornment: verificandoCI ? (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="text.secondary">
                            Verificando...
                          </Typography>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    select
                    label="Extensión"
                    name="ciExtension"
                    value={form.ciExtension}
                    onChange={handleExtensionChange}
                    fullWidth
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                  >
                    {extensionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              {form.ciNumero && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  CI completo: {getIdentificacionCompleta()}
                </Typography>
              )}
            </div>

            <TextField
              label="Correo Institucional (generado)"
              value={generarCorreoInstitucional()}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              helperText="primerNombre.ciNumero@colegio.edu.bo"
            />

            <TextField
              label="Correo Personal"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.correo}
              helperText={errors.correo || "Opcional"}
            />

            <TextField
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              label="Teléfono de Referencia"
              name="telefono_referencia"
              value={form.telefono_referencia}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.telefono_referencia}
              helperText={errors.telefono_referencia || "Solo números (7-15 dígitos)"}
              inputProps={{ maxLength: 15 }}
            />

            <TextField
              type="date"
              label="Fecha de Nacimiento *"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento || "Edad permitida: 5 a 18 años"}
            />

            <TextField
              select
              label="Sexo *"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
            </TextField>

            <TextField
              select
              label="Nacionalidad"
              name="nacionalidad"
              value={form.nacionalidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={loading}
            >
              <MenuItem value="Boliviano/a">Boliviano/a</MenuItem>
              <MenuItem value="Argentino/a">Argentino/a</MenuItem>
              <MenuItem value="Chileno/a">Chileno/a</MenuItem>
              <MenuItem value="Peruano/a">Peruano/a</MenuItem>
              <MenuItem value="Uruguayo/a">Uruguayo/a</MenuItem>
              <MenuItem value="Paraguayo/a">Paraguayo/a</MenuItem>
              <MenuItem value="Brasileño/a">Brasileño/a</MenuItem>
              <MenuItem value="Colombiano/a">Colombiano/a</MenuItem>
              <MenuItem value="Venezolano/a">Venezolano/a</MenuItem>
              <MenuItem value="Ecuatoriano/a">Ecuatoriano/a</MenuItem>
              <MenuItem value="Mexicano/a">Mexicano/a</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading || verificandoCI}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || verificandoCI}
        >
          {loading ? "Actualizando..." : verificandoCI ? "Verificando..." : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}