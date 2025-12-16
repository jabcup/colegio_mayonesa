"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, Typography, Box } from "@mui/material";
import TableAvisos from "../components/avisos/table-avisos";
import FormAviso from "../components/avisos/form-avisos";
import { useState } from "react";

export default function AvisosPage() {
  const [openForm, setOpenForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Forzar recarga de la tabla
  };

  return (
    <>
      <Navbar />
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gestión de Avisos por Curso
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setOpenForm(true)}
          >
            Enviar Nuevo Aviso
          </Button>
        </Box>

        <TableAvisos key={refreshKey} />

        <FormAviso
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSuccess={handleSuccess}
        />
      </Box>
    </>
  );
}