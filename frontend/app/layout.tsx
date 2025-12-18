import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Avisos - Colegio",
  description: "Gestión de avisos para cursos y estudiantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          {children}
          {/* Toasts bonitos en toda la app */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
            expand
            toastOptions={{
              style: {
                fontSize: "15px",
              },
            }}
          />
        </ThemeRegistry>
      </body>
    </html>
  );
}