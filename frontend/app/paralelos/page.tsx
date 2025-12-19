"use client";

import Navbar from "../components/Navbar/navbar";

import {
    Button,
    CircularProgress,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getAuthData } from "../lib/auth";

import { Boton } from "../components/botones/botonNav";
import FormParalelo from "../components/paralelos/form-paralelo";
import TablaParalelo from "../components/paralelos/tabla-paralelo";

interface Paralelo {
    id: number;
    nombre: string;
}

interface BackParalelo {
    id: number;
    nombre: string;
}

export interface UpdateParaleloDto {
    nombre: string;
}

export default function Rol() {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [paralelos, setParalelos] = useState<Paralelo[]>([]);

    const { rol } = getAuthData();

    const cargarParalelos = async () => {
        setLoading(true);
        try {
            const Paralelosres = await api.get("/paralelos/MostrarParalelos");
            
            const ParalelosMap = (Paralelosres.data as BackParalelo[]).map((p) => ({
                id: p.id,
                nombre: p.nombre,
            }));
            
            setParalelos(ParalelosMap);
        } catch (err) {
            console.error(err);
            alert("Error al cargar los paralelos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarParalelos();
    }, []);

    // Función para agregar un nuevo rol
    const crearParalelo = async (data: unknown) => {
        try {
            await api.post("/paralelos/CrearParalelo", data);
            alert("Paralelo creado con éxito");

            cargarParalelos();
        } catch (err) {
            console.error(err);
            alert("Error al crear el paralelo");
        }
    };

    const eliminarParalelo = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este paralelo?")) return;

        try {
            await api.delete(`/paralelos/${id}`);
            alert("Paralelo eliminado");

            cargarParalelos(); // recargar tabla
        } catch (err) {
            console.error(err);
            alert("Error al eliminar");
        }
    };

    const [selectedParalelo, setSelectedParalelo] = useState<Paralelo | null>(null);

    const editarParalelo = (paralelo: Paralelo) => {
        setSelectedParalelo(paralelo);
        setShowForm(true);
    }

    const actualizarParalelo = async (data: UpdateParaleloDto) => {
        if (!selectedParalelo) return;
        
        try {
            await api.put(`/paralelos/${selectedParalelo?.id}`, data);
            alert("Paralelo actualizado con éxito");

            setShowForm(false);
            setSelectedParalelo(null);
            cargarParalelos();
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el paralelo");
        }
    };

    return (
        <>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom>
                Pagina de Paralelos
            </Typography>
            <Boton
            label="Crear Paralelo"
            color="success"
                size="small"
                onClick={() => setShowForm(true)}
                className="ml-2"
            />
            <FormParalelo 
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearParalelo}
                onUpdate={actualizarParalelo}
                selectedParalelo={selectedParalelo}
            />
            <TablaParalelo paralelos = {paralelos} onEdit={editarParalelo} onDelete={eliminarParalelo}/>
        </>
    );
}