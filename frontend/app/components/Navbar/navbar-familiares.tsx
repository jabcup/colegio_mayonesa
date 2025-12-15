"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { Boton } from "../botones/botonNav";
import LogoutButton from "../botones/logout";

interface Props {
  onChangeVista: (vista: "calificaciones" | "asistencias" | "horarios") => void;
  nombreEstudiante?: string;
}

export default function NavbarFamiliares({
  onChangeVista,
  nombreEstudiante,
}: Props) {
  return (
    <AppBar position="static" sx={{ marginBottom: 5}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: 2 }}>
          Mayonesa
          {nombreEstudiante && ` | ${nombreEstudiante}`}
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
        />

        <Boton
          label="Horarios"
          color="success"
          onClick={() => onChangeVista("horarios")}
        />

        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
