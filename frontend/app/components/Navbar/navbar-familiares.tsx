"use client";

import { useState } from "react";
import LogoutButton from "../botones/logout";
import "./NavbarFamiliares.css"; // Asegúrate de crear este archivo

interface Props {
  onChangeVista: (
    vista:
      | "calificaciones"
      | "asistencias"
      | "horarios"
      | "pagos"
      | "notificaciones"
  ) => void;
  nombreEstudiante?: string;
}

export default function NavbarFamiliares({
  onChangeVista,
  nombreEstudiante,
}: Props) {
  const [activeView, setActiveView] = useState<string>("calificaciones");

  const handleViewChange = (vista: any) => {
    setActiveView(vista);
    onChangeVista(vista);
  };

  const menuItems = [
    { id: "calificaciones", label: "📊 Calificaciones" },
    { id: "asistencias", label: "✅ Asistencias", },
    { id: "horarios", label: "⏰ Horarios", },
    { id: "pagos", label: "💰 Pagos", },
    { id: "notificaciones", label: "🔔 Notificaciones", },
  ];

  return (
    <nav className="navbar-familiares">
      <div className="navbar-familiares-container">
        {/* Logo y título */}
        <div className="navbar-familiares-brand">
          <div className="familiares-logo">
            <span className="familiares-logo-icon">👨‍👩‍👧‍👦</span>
          </div>
          <div className="familiares-brand-text">
            <h1 className="familiares-brand-title">
              Portal Familiar
              {nombreEstudiante && (
                <span className="student-name"> | {nombreEstudiante}</span>
              )}
            </h1>
            <p className="familiares-brand-subtitle">
              Información del estudiante
            </p>
          </div>
        </div>

        {/* Menú de navegación */}
        <div className="navbar-familiares-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`familiares-menu-button ${
                activeView === item.id ? "active" : ""
              }`}
              onClick={() => handleViewChange(item.id)}
            >
              <span className="familiares-menu-icon">{item.icon}</span>
              <span className="familiares-menu-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="navbar-familiares-right">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}