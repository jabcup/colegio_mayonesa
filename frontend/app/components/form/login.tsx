"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { api } from "@/app/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginForm() {
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
      // <-- usa el nombre que espera tu backend
      const payload = {
        correo_institucional: correo,
        contrasena,
      };

      console.log("Enviando payload:", payload);

      const res = await api.post("/usuarios/login", payload);

      console.log("Respuesta login:", res);

      // Ajusta según la forma real de respuesta del backend:
      // Por ejemplo: { usuario: { id, correo } } o { data: { usuario: ... } } etc.
      const usuario = res.data?.usuario ?? res.data?.data?.usuario ?? res.data;

      if (!usuario || !usuario.id) {
        // Si el backend devuelve un mensaje de error pero 200, muéstralo
        const msg = res.data?.message || "Respuesta inesperada del servidor";
        setError(msg);
        setLoading(false);
        return;
      }

      // Guardar cookies (duración 1 día)
      Cookies.set("usuario_id", usuario.id.toString(), { expires: 1 });
      Cookies.set("usuario_correo", usuario.correo ?? correo, { expires: 1 });

      // redirigir
      router.push("./estudiante");
    } catch (err: any) {
      console.error("Error en login:", err);

      // Si la API responde con status y data.message:
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("Credenciales inválidas o error de conexión");
      }
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
      <Typography variant="h5" align="center">
        Iniciar Sesión
      </Typography>

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
        onClick={() => router.push("/register")}
      >
        Registrarse
      </Button>
    </Box>
  );
}
