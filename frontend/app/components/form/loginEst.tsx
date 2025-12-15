"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { api } from "@/app/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginEst() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { correo_institucional: correo, rude: contrasena };
      const res = await api.post("/estudiante/login", payload);

      const estudiante = res.data?.estudiante ?? res.data;

      if (!estudiante || !estudiante.id) {
        setError("Credenciales inválidas");
        return;
      }

      // ✅ COOKIES CON PATH CORRECTO
      Cookies.set("estudiante_id", estudiante.id.toString(), { expires: 1, path: "/" });
      Cookies.set("estudiante_correo", estudiante.correo ?? correo, { expires: 1, path: "/" });

      // ✅ REDIRECCIÓN ABSOLUTA
      router.replace("/familiares");
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Credenciales inválidas";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" align="center">Acceso Familiar</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Correo institucional"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        fullWidth
        required
        autoComplete="email"
      />

      <TextField
        label="Contraseña"
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        fullWidth
        required
        autoComplete="current-password"
      />

      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </Button>

      <Button
        size="small"
        color="inherit"
        variant="outlined"
        onClick={() => router.push("/")}
      >
        Ingresar como Administrador
      </Button>
    </Box>
  );
}
