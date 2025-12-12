import { api } from "@/app/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: unknown) => void;
}

export default function FormAsistencia({ open, onClose, onCreate }: Props) {
  const [estudiantes, setEstudiantes] = useState<{ id: number; nombres: string; apellidoPat: string; apellidoMat: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "",
    estado: "",
    estudianteId: "",
  });
    useEffect(() => {
        const fetchEstudiantes = async () => {
            setLoading(true);
            try {
                const response = await api.get<{ id: number; nombres: string; apellidoPat: string; apellidoMat: string }[]>("/estudiantes");
                setEstudiantes(response.data);
            } catch (error) {
                console.error("Error fetching estudiantes:", error);
            }
            setLoading(false);
        };
        fetchEstudiantes();
    }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
    const handleSubmit = () => {
        onCreate({
            fecha: formData.fecha,
            estado: formData.estado,
            estudianteId: parseInt(formData.estudianteId, 10),
        });
        onClose();
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Crear Nueva Asistencia</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <TextField
                            margin="dense"
                            label="Fecha"
                            type="date"
                            name="fecha"
                            fullWidth
                            value={formData.fecha}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Estado"
                            name="estado"
                            fullWidth
                            value={formData.estado}
                            onChange={handleChange}
                        />
                        <TextField
                            select
                            margin="dense"
                            label="Estudiante"
                            name="estudianteId"
                            fullWidth
                            value={formData.estudianteId}
                            onChange={handleChange}
                        >
                            {estudiantes.map((estudiante) => (
                                <MenuItem key={estudiante.id} value={estudiante.id}>
                                    {`${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
}