import axios from "axios";

// Usa la variable de entorno o fallback a localhost para desarrollo
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

console.log('API Base URL:', API_BASE); // Para debug

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 Importantísimo para cookies/sessions
});