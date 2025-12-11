import React from "react";
import styles from "./boton.module.css";
interface BotonProps {
  label: string;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  color?: "primary" | "error" | "success" | "warning" | "default" | "default2";
  variant?: "contained" | "outline" | "text";
  className?: string;
}

export function Boton({
  label,
  onClick,
  size = "medium",
  color = "default",
  variant = "contained",
  className = "",
}: BotonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.boton} ${styles[size]} ${styles[color]} ${styles[variant]} ${className}`}
    >
      {label}
    </button>
  );
}