import axios from "axios";
// AUIDTORIA
import Cookies from "js-cookie";

// Usa la variable de entorno o fallback a localhost para desarrollo
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

console.log("API Base URL:", API_BASE); // Para debug

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 Importantísimo para cookies/sessions
});

// Configuración para la auditoría
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
