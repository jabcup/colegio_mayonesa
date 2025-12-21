"use client";

import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import TablePagos from "@/app/components/pago/table-pago";
import FormPago from "@/app/components/pago/form-pago";
import { api } from "@/app/lib/api";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar/navbar";

type EstudianteOption = {
  id: number;
  label: string;
  identificacion: string;
};

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaTemp, setBusquedaTemp] = useState("");
  const [data, setData] = useState<{
    pagos: any[];
    estudiantes: EstudianteOption[];
  }>({
    pagos: [],
    estudiantes: [],
  });
  const [estudianteSel, setEstudianteSel] = useState<EstudianteOption | null>(
    null
  );

  const [confirmAnio, setConfirmAnio] = useState<{
    open: boolean;
    ids: number[];
    total: number;
  }>({ open: false, ids: [], total: 0 });
  const [confirmTrim, setConfirmTrim] = useState<{
    open: boolean;
    ids: number[];
    total: number;
  }>({ open: false, ids: [], total: 0 });

  const personalId = Number(Cookies.get("personal_id") ?? 0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pagosRes, estRes] = await Promise.all([
        api.get("/pagos"),
        api.get("/estudiante/MostrarEstudiantes"),
      ]);
      const estudiantes: EstudianteOption[] = Array.isArray(estRes.data)
        ? estRes.data.map((e: any) => ({
            id: e.id,
            label: `${e.nombres} ${e.apellidoPat}`,
            identificacion: e.identificacion,
          }))
        : [];

      const mapNombre = new Map(estudiantes.map((e) => [e.id, e.label]));
      const mapId = new Map(estudiantes.map((e) => [e.id, e.identificacion]));

      const pagos = Array.isArray(pagosRes.data)
        ? pagosRes.data.map((p: any) => ({
            ...p,
            nombreEstudiante: mapNombre.get(p.idEstudiante) || "Desconocido",
            identificacion: mapId.get(p.idEstudiante),
          }))
        : [];

      setData({ estudiantes, pagos });
    } catch {
      setData({ estudiantes: [], pagos: [] });
    }
  };

  const handleUpdate = async () => {
    await loadData();
  };

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaTemp), 300);
    return () => clearTimeout(timer);
  }, [busquedaTemp]);

  const pagosFiltrados = (data.pagos ?? []).filter((p) => {
    if (busqueda === "") return true;
    const q = busqueda.toLowerCase();
    return (
      p.nombreEstudiante?.toLowerCase().includes(q) ||
      p.identificacion?.toLowerCase().includes(q) ||
      String(p.idEstudiante).includes(q)
    );
  });

  const handlePagarTrimestre = async () => {
    if (!estudianteSel) return;
    const pendientes = data.pagos
      .filter(
        (p) =>
          p.idEstudiante === estudianteSel.id &&
          p.deuda === "pendiente" &&
          p.tipo === "mensual" &&
          p.concepto.includes("Mensualidad")
      )
      .sort((a, b) => a.anio - b.anio || a.mes - b.mes)
      .slice(0, 3);

    if (pendientes.length < 3) {
      alert("No hay 3 mensualidades consecutivas pendientes");
      return;
    }
    const total = pendientes.reduce((s, p) => s + Number(p.cantidad), 0);
    setConfirmTrim({ open: true, ids: pendientes.map((p) => p.id), total });
  };

  const confirmarPagoTrimestre = async () => {
    try {
      if (!estudianteSel) return;

      await api.patch("/pagos/pagar-trimestre", {
        ids: confirmTrim.ids,
        idpersonal: personalId,
      });

      const pdfRes = await api.get(
        `/pagos/comprobante-trimestre/${estudianteSel.id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `comprobante-trimestre-${estudianteSel?.id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setConfirmTrim({ open: false, ids: [], total: 0 });
      setBusquedaTemp("");
      setBusqueda("");
      await loadData();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al pagar trimestre");
    }
  };

  const handlePagarAnio = async () => {
    if (!estudianteSel) return;
    const pendientes = data.pagos
      .filter(
        (p) =>
          p.idEstudiante === estudianteSel.id &&
          p.deuda === "pendiente" &&
          p.tipo === "mensual" &&
          p.concepto.includes("Mensualidad")
      )
      .sort((a, b) => a.anio - b.anio || a.mes - b.mes)
      .slice(0, 10);

    if (pendientes.length < 10) {
      alert(
        "No hay 10 mensualidades pendientes para aplicar el descuento anual"
      );
      return;
    }
    const total = pendientes.reduce((s, p) => s + Number(p.cantidad), 0);
    setConfirmAnio({ open: true, ids: pendientes.map((p) => p.id), total });
  };

  const confirmarPagoAnio = async () => {
    try {
      // await api.patch('/pagos/pagar-anio', { ids: confirmAnio.ids, idpersonal: personalId })
      if (!estudianteSel) return;

      await api.patch(`/pagos/estudiante/${estudianteSel.id}/pagar-anio`, {
        idpersonal: personalId,
      });
      const pdfRes = await api.get(
        `/pagos/comprobante-anio/${estudianteSel.id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `comprobante-anio-${estudianteSel?.id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setConfirmAnio({ open: false, ids: [], total: 0 });
      setBusquedaTemp("");
      setBusqueda("");
      await loadData();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al pagar año");
    }
  };

  const handleCreate = async () => {
    await loadData();
    setShowForm(false);
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Pagos</h1>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Nuevo Pago
          </Button>
        </div>

        <TextField
          fullWidth
          label="Buscar por nombre, identificación o ID"
          value={busquedaTemp}
          onChange={(e) => setBusquedaTemp(e.target.value)}
          sx={{ mb: 3 }}
        />

        <div className="flex items-center gap-3 mb-4">
          <Autocomplete
            options={data.estudiantes}
            value={estudianteSel}
            onChange={(e, v) => setEstudianteSel(v)}
            getOptionLabel={(o) => `${o.label} | CI: ${o.identificacion}`}
            filterOptions={(options, { inputValue }) => {
              const q = inputValue.toLowerCase();
              return options.filter(
                (o) =>
                  o.label.toLowerCase().includes(q) ||
                  o.identificacion.toLowerCase().includes(q) ||
                  String(o.id).includes(q)
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estudiante (nombre o CI)"
                sx={{ width: 350 }}
              />
            )}
          />
          <Button
            variant="outlined"
            onClick={handlePagarTrimestre}
            disabled={!estudianteSel}
          >
            Pagar trimestre
          </Button>
          <Button
            variant="outlined"
            onClick={handlePagarAnio}
            disabled={!estudianteSel}
          >
            Pagar año
          </Button>
        </div>

        {showForm && (
          <FormPago
            estudiantes={data.estudiantes}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
          />
        )}

        <TablePagos
          pagos={pagosFiltrados}
          estudiantes={data.estudiantes}
          onUpdate={handleUpdate}
        />

        <Dialog
          open={confirmTrim.open}
          onClose={() => setConfirmTrim({ open: false, ids: [], total: 0 })}
          maxWidth="xs"
        >
          <DialogTitle>Confirmar pago trimestre</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Se cancelarán 3 mensualidades
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Total: {confirmTrim.total}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmTrim({ open: false, ids: [], total: 0 })}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={confirmarPagoTrimestre}>
              Pagar y descargar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={confirmAnio.open}
          onClose={() => setConfirmAnio({ open: false, ids: [], total: 0 })}
          maxWidth="xs"
        >
          <DialogTitle>Confirmar pago anual</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Se cancelarán 10 mensualidades
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Total: {confirmAnio.total}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmAnio({ open: false, ids: [], total: 0 })}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={confirmarPagoAnio}>
              Pagar y descargar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
