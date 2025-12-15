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

import FormRol from "../components/rol/form-rol";
import TablaRol from "../components/rol/tabla-rol";

interface Rol {
    id: number;
    nombre: string;
}

interface BackRol {
    id: number;
    nombre: string;
}

export interface UpdateRolDto {
    nombre: string;
}

export default function Rol() {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [roles, setRoles] = useState<Rol[]>([]);

    const { rol } = getAuthData();

    const cargarRoles = async () => {
        setLoading(true);
        try {
            const Rolesres = await api.get("/roles/MostrarRoles");
            
            const RolesMap = (Rolesres.data as BackRol[]).map((r) => ({
                id: r.id,
                nombre: r.nombre,
            }));
            
            setRoles(RolesMap);
        } catch (err) {
            console.error(err);
            alert("Error al cargar los roles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRoles();
    }, []);

    // Función para agregar un nuevo rol
    const crearRol = async (data: unknown) => {
        try {
            await api.post("/roles/CrearRol", data);
            alert("Rol creado con éxito");
        } catch (err) {
            console.error(err);
            alert("Error al crear el rol");
        }
    };

    const eliminarRol = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este rol?")) return;

        try {
            await api.delete(`/roles/${id}`);
            alert("Rol eliminado");

            cargarRoles(); // recargar tabla
        } catch (err) {
            console.error(err);
            alert("Error al eliminar");
        }
    };

    const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

    const editarRol = (rol: Rol) => {
        setSelectedRol(rol);
        setShowForm(true);
    }

    const actualizarRol = async (data: UpdateRolDto) => {
        if (!selectedRol) return;
        
        try {
            await api.put(`/roles/${selectedRol?.id}`, data);
            alert("Rol actualizado con éxito");

            setShowForm(false);
            setSelectedRol(null);
            cargarRoles();
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el rol");
        }
    };

    return (
        <>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom>
                Pagina de Roles
            </Typography>
            {rol !== "Secretaria-o" && (
            <Button
                variant="contained"
                onClick={() => setShowForm(true)}
                sx={{mb:2}}
            >
                Crear Rol
            </Button>
            )}
            <FormRol 
                open={showForm}
                onClose={() => setShowForm(false)}
                onCreate={crearRol}
                onUpdate={actualizarRol}
                selectedRol={selectedRol}
            />
            <TablaRol roles = {roles} onEdit={editarRol} onDelete={eliminarRol}/>
        </>
    );
}