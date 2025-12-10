"use client";

import Navbar from "@/app/components/Navbar/navbar";
import { Button, CircularProgress, Typography } from "@mui/material";
import FormEstudiante from "../components/estudiante/form";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import TableEstudiante from "../components/estudiante/table";

interface Estudiante {
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
    relacion: string;
    padre: {
        id: number;
        nombres: string;
        apellidoPat: string;
        telefono: string;
    };
    curso: {
        id: number;
        nombre: string;
        paralelo: string;
    };
}

export default function Estudiante() {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [loading, setLoading] = useState(true);
    const [ShowForm, setShowForm] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        cargarEstudiantes();
    }, []);

    const cargarEstudiantes = async () => {
        setLoading(true);
        try {
            const res = await api.get("/estudiantes/MostrarEstudiantes");
            setEstudiantes(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const crearEstudiante = async (data: unknown) => {
        try {
            const res = await api.post('/estudiante/CrearEstudianteCompleto', data);
            alert("Estudiante creado exitosamente");
            console.log(res.data);
        } catch (err: unknown) {
            console.error(err);
            alert("Error al crear el estudiante");
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleCreateUser = () => {
        setModalOpen(false); // Cierra el modal
        setShowForm(true); // Abre el formulario
    };

    return (
        <>
            <Navbar />
            <Typography variant="h3">Estudiante</Typography>
            <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }} >
                Crear Nuevo Producto
            </Button>
            <FormEstudiante
                open={ShowForm}
                onClose={() => setShowForm(false)}
                onCreate={crearEstudiante}
            />
            {loading ? <CircularProgress /> : <TableEstudiante estudiantes={estudiantes} />}
        </>
    )
}