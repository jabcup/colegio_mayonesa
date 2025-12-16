"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Boton } from "../botones/botonNav";

export default function Navbar() {
    const router = useRouter();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Mayonesa
                </Typography>
                <Button variant="outlined" color="inherit" onClick={() => router.push("/estudiante")}>
                    Estudiantes
                </Button>
                <Boton label="Crear Estudiante" color="success" size="medium" className="ml-2" onClick={() => router.push("/estudiante")} />
                <Boton label="Calificaciones" color="success" size="medium" className="ml-2" onClick={() => router.push("/calificacion")} />
                <Boton label="Asistencias" color="success" size="medium" className="ml-2" onClick={() => router.push("/asistencias")} />
                <Boton label="Avisos" color="success" size="medium" className="ml-2" onClick={() => router.push("/aviso")} />
         </Toolbar>
        </AppBar>
    );
}
