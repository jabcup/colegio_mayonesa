"use client";

import Navbar from "@/app/components/Navbar/navbar";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import FormEstudiante from "../components/estudiante/form";
import FormPadre from "../components/estudiante/formPadre";
import FormAsignarPadreEstudiante from "../components/estudiante/formTutor"; // Cambia el nombre
import TableEstudiante from "../components/estudiante/table";
import { getAuthData } from "../lib/auth";
import { Boton } from "../components/botones/botonNav";

interface EstudianteFull {
  id: number;
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
  tutor: {
    id: number;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
    telefono: string;
    estado: string;
  };
  relacion: string;
  fecha_creacion: string;
  estado: string;
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<EstudianteFull[]>([]);
  const [filtered, setFiltered] = useState<EstudianteFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormEstudiante, setShowFormEstudiante] = useState(false);
  const [showFormPadre, setShowFormPadre] = useState(false);
  const [showFormAsignarPadre, setShowFormAsignarPadre] = useState(false);
  const [loadingPadre, setLoadingPadre] = useState(false);
  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  const { rol, idPersonal } = getAuthData();

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      estudiantes.filter((e) => {
        const fullName = `${e.estudiante.nombres} ${e.estudiante.apellidoPat} ${e.estudiante.apellidoMat}`.toLowerCase();
        return (
          fullName.includes(s) ||
          e.estudiante.identificacion.includes(s) ||
          e.estudiante.correo.toLowerCase().includes(s)
        );
      })
    );
  }, [search, estudiantes]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/padre-estudiante/todos");
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch {
      showSnackbar("Error al cargar estudiantes", "error");
    } finally {
      setLoading(false);
    }
  };

  const crearEstudiante = async (data: any) => {
    try {
      await api.post("/estudiante/CrearEstudianteCompleto", data);
      showSnackbar("Estudiante creado exitosamente", "success");
      setShowFormEstudiante(false);
      cargarEstudiantes();
    } catch (err: any) {
      showSnackbar(
        err?.response?.data?.message || "Error al crear estudiante",
        "error"
      );
    }
  };

  const crearPadre = async (data: any) => {
    setLoadingPadre(true);
    try {
      await api.post("/padres/CrearPadre", data);
      showSnackbar("Padre registrado exitosamente", "success");
      setShowFormPadre(false);
    } catch (err: any) {
      showSnackbar(
        err?.response?.data?.message || "Error al registrar padre",
        "error"
      );
    } finally {
      setLoadingPadre(false);
    }
  };

  const asignarPadreAEstudiante = async (data: any) => {
    try {
      await api.post("/padre-estudiante/asignar", data);
      showSnackbar("Tutor asignado exitosamente", "success");
      setShowFormAsignarPadre(false);
      cargarEstudiantes();
    } catch (err: any) {
      showSnackbar(
        err?.response?.data?.message || "Error al asignar tutor",
        "error"
      );
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Navbar />

      {/* <div style={{ padding: "20px" }}> */}
        <Typography variant="h4" sx={{ mb: 2 }}>
          Estudiantes
        </Typography>

        <TextField
          label="Buscar por nombre, CI o correo"
          fullWidth
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {rol !== "Cajero" && rol !== "Docente" && (
          <div style={{ marginBottom: "20px" }}>
            <Boton
              label="Registrar Estudiante"
              className="m-2"
              color="success"
              onClick={() => setShowFormEstudiante(true)}
            />
            <Boton
              label="Registrar Padre de Familia"
              className="m-2"
              color="success"
              onClick={() => setShowFormPadre(true)}
            />
            <Boton
              label="Asignar Tutor a Estudiante"
              className="m-2"
              color="primary"
              onClick={() => setShowFormAsignarPadre(true)}
            />
          </div>
        )}

        <FormEstudiante
          open={showFormEstudiante}
          onClose={() => setShowFormEstudiante(false)}
          onCreate={crearEstudiante}
        />

        <FormPadre
          open={showFormPadre}
          onClose={() => setShowFormPadre(false)}
          onCreate={crearPadre}
          loading={loadingPadre}
        />

        <FormAsignarPadreEstudiante
          open={showFormAsignarPadre}
          onClose={() => setShowFormAsignarPadre(false)}
          onSuccess={() => {
            cargarEstudiantes();
            setShowFormAsignarPadre(false);
          }}
        />

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : filtered.length ? (
          <TableEstudiante estudiantes={filtered} />
        ) : (
          <Typography>No hay estudiantes registrados</Typography>
        )}
      {/* </div> */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}