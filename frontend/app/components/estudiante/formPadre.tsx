import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  loading?: boolean; // Prop opcional para mostrar carga
}

interface FormErrors {
  [key: string]: string;
}

export default function FormPadre({ open, onClose, onCreate, loading = false }: Props) {    
  const [form, setForm] = useState({
    nombres: "",
    apellidoPat: "",
    apellidoMat: "", // Opcional
    telefono: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validación en tiempo real
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case "nombres":
        if (!value.trim()) {
          error = "Nombres es requerido";
        } else if (value.length < 2 || value.length > 50) {
          error = "Nombres debe tener entre 2 y 50 caracteres";
        }
        break;
      
      case "apellidoPat":
        if (!value.trim()) {
          error = "Apellido Paterno es requerido";
        } else if (value.length < 2 || value.length > 50) {
          error = "Apellido Paterno debe tener entre 2 y 50 caracteres";
        }
        break;
      
      case "apellidoMat":
        // Opcional, solo validar longitud si se ingresa algo
        if (value && value.trim() !== "") {
          if (value.length < 2 || value.length > 50) {
            error = "Apellido Materno debe tener entre 2 y 50 caracteres";
          }
        }
        break;
      
      case "telefono":
        if (!value.trim()) {
          error = "Teléfono es requerido";
        } else if (!/^[0-9]{7,15}$/.test(value)) {
          error = "Teléfono inválido (7-15 dígitos)";
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar nombres
    if (!form.nombres.trim()) {
      newErrors.nombres = "Nombres es requerido";
    } else if (form.nombres.length < 2 || form.nombres.length > 50) {
      newErrors.nombres = "Nombres debe tener entre 2 y 50 caracteres";
    }
    
    // Validar apellido paterno
    if (!form.apellidoPat.trim()) {
      newErrors.apellidoPat = "Apellido Paterno es requerido";
    } else if (form.apellidoPat.length < 2 || form.apellidoPat.length > 50) {
      newErrors.apellidoPat = "Apellido Paterno debe tener entre 2 y 50 caracteres";
    }
    
    // Validar apellido materno (opcional)
    if (form.apellidoMat && form.apellidoMat.trim() !== "") {
      if (form.apellidoMat.length < 2 || form.apellidoMat.length > 50) {
        newErrors.apellidoMat = "Apellido Materno debe tener entre 2 y 50 caracteres";
      }
    }
    
    // Validar teléfono
    if (!form.telefono.trim()) {
      newErrors.telefono = "Teléfono es requerido";
    } else if (!/^[0-9]{7,15}$/.test(form.telefono)) {
      newErrors.telefono = "Teléfono inválido (7-15 dígitos)";
    }
    
    setErrors(newErrors);
    
    // Verificar si hay errores
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      nombres: form.nombres.trim(),
      apellidoPat: form.apellidoPat.trim(),
      apellidoMat: form.apellidoMat.trim(),
      telefono: form.telefono.trim(),
    };

    // Agregar apellidoMat solo si tiene valor
    if (form.apellidoMat && form.apellidoMat.trim() !== "") {
      payload.apellidoMat = form.apellidoMat.trim();
    }

    onCreate(payload);
  };

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setForm({
      nombres: "",
      apellidoPat: "",
      apellidoMat: "",
      telefono: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Padre</DialogTitle>

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
              error={!!errors.nombres}
              helperText={errors.nombres}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            
            <TextField
              label="Apellido Paterno *"
              name="apellidoPat"
              value={form.apellidoPat}
              onChange={handleChange}
              error={!!errors.apellidoPat}
              helperText={errors.apellidoPat}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            
            <TextField
              label="Apellido Materno"
              name="apellidoMat"
              value={form.apellidoMat}
              onChange={handleChange}
              error={!!errors.apellidoMat}
              helperText={errors.apellidoMat || "Opcional"}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            
            <TextField
              label="Teléfono *"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono || "7-15 dígitos"}
              fullWidth
              margin="normal"
              disabled={loading}
              inputProps={{ 
                maxLength: 15,
                inputMode: "numeric"
              }}
            />
            
            <FormHelperText sx={{ mt: 2, color: 'text.secondary' }}>
              * Campos obligatorios
            </FormHelperText>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}