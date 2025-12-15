"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";

interface Props {
  onChangeVista: (vista: "calificaciones" | "asistencias" | "horarios") => void;
}

export default function NavbarFamiliares({ onChangeVista }: Props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mayonesa
        </Typography>

        <Boton
          label="Calificaciones"
          color="success"
          onClick={() => onChangeVista("calificaciones")}
        />

        <Boton
          label="Asistencias"
          color="success"
          onClick={() => onChangeVista("asistencias")}
          className="ml-2"
        />

        <Boton
          label="Horarios"
          color="success"
          onClick={() => onChangeVista("horarios")}
          className="ml-2"
        />

        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
