"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";

export default function Navbar() {
  const router = useRouter();
  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mayonesa
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => router.push("/estudiante")}
        >
          Estudiantes
        </Button>
        <Boton
          label="Crear Estudiante"
          color="success"
          size="medium"
          className="ml-2"
          onClick={() => router.push("/estudiante")}
        />
        <Boton
          label="Calificaciones"
          color="success"
          size="medium"
          className="ml-2"
          onClick={() => router.push("/calificacion")}
        />
        <Boton
          label="Asistencias"
          color="success"
          size="medium"
          className="ml-2"
          onClick={() => router.push("/asistencias")}
        />
        <Boton
          label="Hijos"
          color="success"
          size="medium"
          className="ml-2"
          onClick={() => router.push("/padre-hijo")}
        />
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => router.push("/pago")}
        >
          Pagos
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          onClick={() => router.push("/personal")}
        >
          Personal
        </Button>
          <Boton
            label="Materias"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/materias")}
          />
          <Boton
            label="Horarios"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/horarios")}
          />
          <Boton
            label="Pagos"
            color="success"
            size="small"
            className="ml-2"
            onClick={() => router.push("/pago")}
          />
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
