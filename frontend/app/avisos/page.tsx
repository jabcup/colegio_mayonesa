// app/avisos/page.tsx
"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, Typography, Box } from "@mui/material";
import TableAvisos from "../components/avisos/table-avisos";
import FormAviso from "../components/avisos/form-avisos";
import { useState } from "react";

interface Aviso {
  id: number;
  asunto: string;
  mensaje: string;
  Curso: { id: number; nombre: string; nivel?: string; paralelo?: { id: number; nombre: string } };
}

export default function AvisosPage() {
  const [openForm, setOpenForm] = useState(false);
  const [avisoToEdit, setAvisoToEdit] = useState<Aviso | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setAvisoToEdit(null);
  };

  const handleEdit = (aviso: Aviso) => {
    setAvisoToEdit(aviso);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setAvisoToEdit(null);
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

        <TableAvisos key={refreshKey} onEdit={handleEdit} />

        <FormAviso
          open={openForm}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
          avisoToEdit={avisoToEdit}
        />
      </Box>
    </>
  );
}