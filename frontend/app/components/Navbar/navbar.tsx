"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../botones/logout";
import { getAuthData } from "@/app/lib/auth";
import BadgeNotificaciones from "../notificaciones-docente/BadgeNotificaciones";
import styles from "./Navbar.module.css"; // ¡Importa desde el mismo directorio!

export default function Navbar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);

  const auth = getAuthData();
  const rol = auth?.rol;
  const usuarioId = auth?.usuarioId ? Number(auth.usuarioId) : null;

  if (!rol) {
    return null;
  }

  // Definir las secciones del menú según el rol
  const getMenuSections = () => {
    const baseSections = {
      gestionAcademica: {
        label: "Gestión Académica",
        icon: "📚",
        submenus: [
          { label: "Estudiantes", path: "/estudiante", roles: ["all"] },
          { label: "Calificaciones", path: "/calificacion", roles: ["Administrador", "Docente", "Secretaria-o"] },
          { label: "Asistencias", path: "/asistencias", roles: ["Administrador", "Docente", "Secretaria-o"] },
          { label: "Materias", path: "/materias", roles: ["Administrador"] },
          { label: "Cursos", path: "/cursos", roles: ["Administrador"] },
          { label: "Horarios", path: "/horarios", roles: ["Administrador"] },
        ]
      },
      gestionPersonal: {
        label: "Gestión de Personal",
        icon: "👥",
        submenus: [
          { label: "Personal", path: "/personal", roles: ["Administrador", "Director"] },
          { label: "Asignaciones", path: "/asignacion", roles: ["Administrador", "Docente", "Secretaria-o"] },
          { label: "Tutores", path: "/tutor", roles: ["Administrador"] },
        ]
      },
      gestionFinanciera: {
        label: "Gestión Financiera",
        icon: "💰",
        submenus: [
          { label: "Pagos", path: "/pago", roles: ["Administrador", "Director", "Cajero"] },
          { label: "Reportes", path: "/reporte", roles: ["all"] },
        ]
      },
      comunicaciones: {
        label: "Comunicaciones",
        icon: "📢",
        submenus: [
          { label: "Notificaciones", path: "/notificaciones", roles: ["Administrador", "Director", "Secretaria-o"] },
          { label: "Avisos", path: "/avisos", roles: ["Administrador", "Director", "Secretaria-o"] },
        ]
      },
      sistema: {
        label: "Sistema",
        icon: "⚙️",
        submenus: [
          { label: "Roles", path: "/rol", roles: ["Administrador", "Director"] },
          { label: "Auditoría", path: "/auditoria", roles: ["Administrador"] },
        ]
      }
    };

    // Filtrar submenús según el rol
    Object.keys(baseSections).forEach(key => {
      baseSections[key].submenus = baseSections[key].submenus.filter(item => 
        item.roles.includes("all") || item.roles.includes(rol)
      );
    });

    // Eliminar secciones vacías
    return Object.keys(baseSections)
      .filter(key => baseSections[key].submenus.length > 0)
      .reduce((obj, key) => {
        obj[key] = baseSections[key];
        return obj;
      }, {});
  };

  const menuSections = getMenuSections();

  const handleMenuClick = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleSubmenuClick = (path: string) => {
    router.push(path);
    setOpenMenu(null);
    setHoverMenu(null);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo y título */}
        <div className={styles.navbarBrand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏫</span>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.brandTitle}>Colegio Mayo</h1>
            <p className={styles.brandSubtitle}>Sección Administrativa</p>
          </div>
        </div>

        {/* Menús principales */}
        <div className={styles.navbarMenus}>
          {Object.entries(menuSections).map(([key, section]) => (
            <div 
              key={key}
              className={`${styles.menuSection} ${openMenu === key ? styles.active : ''} ${hoverMenu === key ? styles.hover : ''}`}
              onMouseEnter={() => setHoverMenu(key)}
              onMouseLeave={() => setHoverMenu(null)}
            >
              <button
                className={styles.menuButton}
                onClick={() => handleMenuClick(key)}
              >
                <span className={styles.menuIcon}>{section.icon}</span>
                <span className={styles.menuLabel}>{section.label}</span>
                <span className={styles.menuArrow}>▼</span>
              </button>

              {/* Submenú desplegable */}
              {(openMenu === key || hoverMenu === key) && (
                <div className={styles.submenu}>
                  <div className={styles.submenuContent}>
                    {section.submenus.map((item, index) => (
                      <button
                        key={index}
                        className={styles.submenuItem}
                        onClick={() => handleSubmenuClick(item.path)}
                      >
                        <span className={styles.submenuLabel}>{item.label}</span>
                        <span className={styles.submenuArrow}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Parte derecha: Notificaciones y Logout */}
        <div className={styles.navbarRight}>
          {rol === "Docente" && usuarioId && (
            <div className={styles.notificationsContainer}>
              <BadgeNotificaciones docenteId={usuarioId} />
            </div>
          )}

          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.avatarIcon}>👤</span>
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userRole}>{rol}</span>
            </div>
          </div>

          <div className={styles.logoutContainer}>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}