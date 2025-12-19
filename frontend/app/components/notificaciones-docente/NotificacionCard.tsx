"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  NotificationsActive,
  CheckCircle,
  Schedule,
  BookOutlined,
} from "@mui/icons-material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Asignacion {
  id: number;
  // Puedes agregar más campos cuando los tengas, ej: curso, paralelo, etc.
}

interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  fecha_creacion: string;
  leida: boolean;
  fecha_leida: string | null;
  asignacion?: Asignacion;
}

interface Props {
  notificacion: Notificacion;
  onMarcarLeida: () => void;
}

export default function NotificacionCard({ notificacion, onMarcarLeida }: Props) {
  const {
    mensaje,
    tipo,
    fecha_creacion,
    leida,
    fecha_leida,
    asignacion,
  } = notificacion;

  const fechaFormateada = format(new Date(fecha_creacion), "PPP p", { locale: es });

  return (
    <Card
      elevation={leida ? 1 : 6}
      sx={{
        borderLeft: 4,
        borderColor: leida ? "grey.300" : "primary.main",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-2px)",
        },
        cursor: leida ? "default" : "pointer",
      }}
      onClick={() => !leida && onMarcarLeida()}
    >
      <CardContent sx={{ pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {/* Icono principal según estado */}
          <Box sx={{ mt: 0.5 }}>
            {leida ? (
              <CheckCircle color="success" fontSize="large" />
            ) : (
              <NotificationsActive color="primary" fontSize="large" />
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {/* Cabecera: fecha y tipo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {tipo === "asignacion_curso" && (
                <Chip
                  icon={<BookOutlined />}
                  label="Asignación de curso"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}

              <Typography variant="body2" color="text.secondary">
                {fechaFormateada}
              </Typography>

              {!leida && (
                <Chip
                  label="Nueva"
                  size="small"
                  color="error"
                  sx={{ ml: "auto" }}
                />
              )}
            </Box>

            {/* Mensaje principal */}
            <Typography variant="body1" sx={{ mb: 2, fontWeight: leida ? "normal" : "medium" }}>
              {mensaje}
            </Typography>

            {/* Detalle de asignación si existe */}
            {asignacion && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ bgcolor: "primary.50", p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="primary.dark" gutterBottom>
                    Detalle de la asignación
                  </Typography>
                  <Typography variant="body2">
                    <strong>ID de asignación:</strong> {asignacion.id}
                  </Typography>
                  {/* Aquí puedes agregar más datos cuando los tengas */}
                </Box>
              </>
            )}

            {/* Fecha de lectura (si ya fue leída) */}
            {leida && fecha_leida && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule fontSize="small" color="disabled" />
                <Typography variant="caption" color="text.disabled">
                  Leída el {format(new Date(fecha_leida), "PPP p", { locale: es })}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Botón para marcar como leída (opcional, si prefieres clic en toda la card) */}
          {!leida && (
            <Tooltip title="Marcar como leída">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onMarcarLeida();
                }}
                color="primary"
              >
                <CheckCircle />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}