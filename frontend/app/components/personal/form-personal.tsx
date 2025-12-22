"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import { api } from "@/app/lib/api";

interface Rol {
  id: number;
  nombre: string;
}

interface Personal {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat?: string;
  telefono?: string;
  identificacion: string;
  direccion?: string;
  correo: string;
  fecha_nacimiento?: string;
  idRol: number;
}

interface FormData {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat?: string;
  telefono?: string;
  ciNumero: string;
  ciExtension: string;
  direccion?: string;
  correo: string;
  fecha_nacimiento?: string;
  idRol: number;
}

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

const defaultValues: FormData = {
  id: 0,
  nombres: "",
  apellidoPat: "",
  apellidoMat: "",
  telefono: "",
  ciNumero: "",
  ciExtension: "",
  direccion: "",
  correo: "",
  fecha_nacimiento: "",
  idRol: 1,
};

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const validarSoloLetras = (texto: string): boolean => {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());
};

// Función para extraer solo el número del CI (sin extensión)
const extraerNumeroCI = (identificacion: string): string => {
  // Elimina cualquier extensión al final
  return identificacion.replace(/\s+[A-Za-z]{1,2}$/, '').trim();
};

// Función para verificar si un CI ya existe en el sistema
const verificarCIUnico = async (ciNumero: string, idPersonalActual?: number): Promise<boolean> => {
  if (!ciNumero.trim()) return true;
  
  try {
    // Buscar si ya existe un personal con el mismo número de CI
    const response = await api.get(`/personal/verificar-ci-unico?ciNumero=${ciNumero}&idExcluir=${idPersonalActual || 0}`);
    return response.data.esUnico;
  } catch (error) {
    console.error('Error verificando CI único:', error);
    return true; // En caso de error, permitir continuar
  }
};

export default function PersonalForm({
  personalToEdit,
  onClose,
}: {
  personalToEdit?: Personal;
  onClose?: () => void;
}) {
  const router = useRouter();
  const isEdit = !!personalToEdit;
  const [form, setForm] = useState<FormData>(defaultValues);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificandoCI, setVerificandoCI] = useState(false);

  useEffect(() => {
    api
      .get("/roles/RolesActivos")
      .then((r) => setRoles(r.data))
      .catch(() => alert("Error al cargar roles"));
  }, []);

  useEffect(() => {
    if (personalToEdit) {
      // Parsear la identificación existente
      const ciNumero = extraerNumeroCI(personalToEdit.identificacion);
      const ciMatch = personalToEdit.identificacion.match(/([A-Za-z]{1,2})$/);
      const ciExtension = ciMatch ? ciMatch[0] : '';
      
      setForm({
        ...defaultValues,
        ...personalToEdit,
        ciNumero,
        ciExtension,
      });
    } else {
      setForm(defaultValues);
    }
  }, [personalToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "nombres" || name === "apellidoPat" || name === "apellidoMat") {
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (!soloLetras.test(value)) {
        return;
      }
    }
    
    if (name === "ciNumero") {
      // Solo permitir números
      const soloNumeros = value.replace(/\D/g, '');
      setForm({ ...form, [name]: soloNumeros });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleExtensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm({ ...form, ciExtension: value });
    
    if (errors.ciNumero) {
      setErrors({ ...errors, ciNumero: "" });
    }
  };

  // Función para validar CI único en tiempo real (onBlur)
  const validarCIUnicoEnTiempoReal = async () => {
    if (!form.ciNumero.trim() || form.ciNumero.length < 5) return;
    
    setVerificandoCI(true);
    try {
      const esUnico = await verificarCIUnico(form.ciNumero, form.id);
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

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (!form.nombres.trim()) {
      newErrors.nombres = "Nombres es requerido";
    } else if (!validarSoloLetras(form.nombres)) {
      newErrors.nombres = "Los nombres solo deben contener letras y espacios";
    }

    if (!form.apellidoPat.trim()) {
      newErrors.apellidoPat = "Apellido paterno es requerido";
    } else if (!validarSoloLetras(form.apellidoPat)) {
      newErrors.apellidoPat = "El apellido paterno solo debe contener letras y espacios";
    }

    if (form.apellidoMat && form.apellidoMat.trim() !== "" && !validarSoloLetras(form.apellidoMat)) {
      newErrors.apellidoMat = "El apellido materno solo debe contener letras y espacios";
    }

    // Validación del CI
    if (!form.ciNumero.trim()) {
      newErrors.ciNumero = "Número de CI es requerido";
    } else if (!/^\d+$/.test(form.ciNumero)) {
      newErrors.ciNumero = "El número de CI debe contener solo números";
    } else if (form.ciNumero.length < 5) {
      newErrors.ciNumero = "El número de CI debe tener al menos 5 dígitos";
    } else {
      // Validar unicidad del CI
      try {
        const esUnico = await verificarCIUnico(form.ciNumero, form.id);
        if (!esUnico) {
          newErrors.ciNumero = "Este número de CI ya está registrado en el sistema";
        }
      } catch (error) {
        console.error('Error validando unicidad del CI:', error);
        newErrors.ciNumero = "Error al verificar la unicidad del CI. Intente nuevamente.";
      }
    }

    if (form.telefono && form.telefono.trim() !== "") {
      if (!/^\d+$/.test(form.telefono)) {
        newErrors.telefono = "El teléfono debe contener solo números";
      } else if (form.telefono.length !== 8) {
        newErrors.telefono = "El teléfono debe tener 8 dígitos";
      }
    }

    if (!form.correo.trim()) {
      newErrors.correo = "Correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }

    if (form.fecha_nacimiento) {
      const edad = calcularEdad(form.fecha_nacimiento);
      if (edad < 18) {
        newErrors.fecha_nacimiento = "El personal debe tener al menos 18 años";
      }
    } else {
      newErrors.fecha_nacimiento = "Fecha de nacimiento es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const esValido = await validateForm();
    if (!esValido) {
      return;
    }

    try {
      const identificacionCompleta = getIdentificacionCompleta();
      const { id, ciNumero, ciExtension, ...rest } = form;

      const payload: any = {
        nombres: rest.nombres.trim(),
        apellidoPat: rest.apellidoPat.trim(),
        identificacion: identificacionCompleta,
        correo: rest.correo.trim(),
        idRol: rest.idRol,
      };

      if (rest.apellidoMat?.trim()) payload.apellidoMat = rest.apellidoMat.trim();
      if (rest.telefono?.trim()) payload.telefono = rest.telefono.trim();
      if (rest.direccion?.trim()) payload.direccion = rest.direccion.trim();
      if (rest.fecha_nacimiento?.trim()) payload.fecha_nacimiento = rest.fecha_nacimiento.trim();

      isEdit
        ? await api.put(`/personal/EditarPersonal/${form.id}`, payload)
        : await api.post('/personal/CrearPersonalCompleto', payload);
      
      alert(isEdit ? 'Personal actualizado' : 'Personal creado');
      onClose ? onClose() : router.back();
    } catch (e: any) {
      if (e.response?.data?.message?.includes('identificacion') || e.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          ciNumero: "Este número de CI ya está registrado en el sistema"
        }));
      } else {
        alert(e.response?.data?.message || 'Error al guardar');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        {isEdit ? "Editar Personal" : "Nuevo Personal"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {!isEdit && (
          <TextField
            select
            label="Rol"
            name="idRol"
            value={form.idRol}
            onChange={handleChange}
            required
            error={!!errors.idRol}
            helperText={errors.idRol}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
        
        <TextField
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
          required
          error={!!errors.nombres}
          helperText={errors.nombres}
          inputProps={{ maxLength: 100 }}
        />
        
        <TextField
          label="Apellido Paterno"
          name="apellidoPat"
          value={form.apellidoPat}
          onChange={handleChange}
          required
          error={!!errors.apellidoPat}
          helperText={errors.apellidoPat}
          inputProps={{ maxLength: 50 }}
        />
        
        <TextField
          label="Apellido Materno (opcional)"
          name="apellidoMat"
          value={form.apellidoMat}
          onChange={handleChange}
          error={!!errors.apellidoMat}
          helperText={errors.apellidoMat}
          inputProps={{ maxLength: 50 }}
        />
        
        <TextField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          error={!!errors.telefono}
          helperText={errors.telefono}
          inputProps={{ maxLength: 8 }}
        />
        
        {/* Campo de CI con extensión */}
        <Box>
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
                required
                error={!!errors.ciNumero}
                helperText={errors.ciNumero || "El número de CI debe ser único"}
                fullWidth
                disabled={verificandoCI}
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
        </Box>
        
        <TextField
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          inputProps={{ maxLength: 200 }}
        />
        
        <TextField
          label="Correo"
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          required
          error={!!errors.correo}
          helperText={errors.correo}
          inputProps={{ maxLength: 100 }}
        />
        
        <TextField
          label="Fecha Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          required
          error={!!errors.fecha_nacimiento}
          helperText={errors.fecha_nacimiento}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: new Date().toISOString().split('T')[0] }}
        />
        
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose || (() => router.back())}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={verificandoCI}
          >
            {verificandoCI ? "Verificando..." : (isEdit ? "Actualizar" : "Guardar")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}