"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, Typography, Box } from "@mui/material";
import FormNotificacion from "../components/notificacion/form-notificacion";
import TableNotificaciones from "../components/notificacion/table-notificacion";
import { useState } from "react";

export default function NotificacionesPage() {
  const [showSendForm, setShowSendForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowSendForm(false);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ px: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gestión de Notificaciones
        </Typography>

        <Box sx={{ display: "flex", gap: 2, my: 3, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setShowSendForm(true)}
          >
            Enviar Notificación
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => setShowTable((prev) => !prev)}
          >
            {showTable ? "Ocultar Notificaciones" : "Mostrar Notificaciones"}
          </Button>
        </Box>

        {showTable && <TableNotificaciones key={refreshKey} />}

        <FormNotificacion
          open={showSendForm}
          onClose={() => setShowSendForm(false)}
          onSuccess={handleSuccess}
        />
      </Box>
    </>
  );
}