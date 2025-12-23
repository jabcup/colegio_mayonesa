"use client"

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
import { useState, useEffect } from "react"
import { Button, TextField, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material"
import TablePagos from "@/app/components/pago/table-pago"
import FormPago from "@/app/components/pago/form-pago"
import { api } from "@/app/lib/api"
import Cookies from "js-cookie"
import Navbar from "../components/Navbar/navbar"
import { getAuthData } from "../lib/auth"

type EstudianteOption = {
  id: number
  label: string
  identificacion: string
}

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [busquedaTemp, setBusquedaTemp] = useState("")
  const [data, setData] = useState<{ pagos: any[]; estudiantes: EstudianteOption[] }>({
    pagos: [],
    estudiantes: [],
  })
  const [estudianteSel, setEstudianteSel] = useState<EstudianteOption | null>(null)

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
  const [confirmAnio, setConfirmAnio] = useState<{ open: boolean; ids: number[]; total: number }>({ open: false, ids: [], total: 0 })
  const [confirmTrim, setConfirmTrim] = useState<{ open: boolean; ids: number[]; total: number }>({ open: false, ids: [], total: 0 })
    const auth = getAuthData();
  const rol = auth?.rol;
    const usuarioId = auth?.usuarioId ? Number(auth.usuarioId) : null;

  if (!rol) {
    return null;
  }
  const personalId = Number(Cookies.get("personal_id") ?? 0)

  useEffect(() => { loadData() }, [])
  
  const loadData = async () => {
    try {
      const [pagosRes, estRes] = await Promise.all([
        api.get("/pagos"),
        api.get("/estudiante/MostrarEstudiantes"),
      ])
      const estudiantes: EstudianteOption[] = Array.isArray(estRes.data)
        ? estRes.data.map((e: any) => ({
            id: e.id,
            label: `${e.nombres} ${e.apellidoPat}`,
            identificacion: e.identificacion,
          }))
        : []

      const mapNombre = new Map(estudiantes.map(e => [e.id, e.label]))
      const mapId = new Map(estudiantes.map(e => [e.id, e.identificacion]))

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
        : []

      setData({ estudiantes, pagos })
    } catch {
      setData({ estudiantes: [], pagos: [] })
    }
  }

  const handleUpdate = async () => {
    await loadData()
  }

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(busquedaTemp), 300)
    return () => clearTimeout(timer)
  }, [busquedaTemp])

  const pagosFiltrados = (data.pagos ?? []).filter((p) => {
    if (busqueda === "") return true;
    const q = busqueda.toLowerCase();
  const pagosFiltrados = (data.pagos ?? []).filter(p => {
    if (busqueda === "") return true
    const q = busqueda.toLowerCase()
    return (
      p.nombreEstudiante?.toLowerCase().includes(q) ||
      p.identificacion?.toLowerCase().includes(q) ||
      String(p.idEstudiante).includes(q)
    )
  })

  const handlePagarTrimestre = async () => {
    if (!estudianteSel) return
    const pendientes = data.pagos
      .filter(p => p.idEstudiante === estudianteSel.id && p.deuda === 'pendiente' && p.tipo === 'mensual')
      .sort((a, b) => a.anio - b.anio || a.mes - b.mes)

    if (pendientes.length < 3) {
      alert('No hay 3 mensualidades pendientes')
      return
    }

    const sonConsecutivos = (pagos: any[]) => {
      for (let i = 1; i < pagos.length; i++) {
        const anterior = pagos[i - 1]
        const actual = pagos[i]
        
        const mesEsperado = anterior.mes === 12 ? 1 : anterior.mes + 1
        const anioEsperado = anterior.mes === 12 ? anterior.anio + 1 : anterior.anio
        
        if (actual.mes !== mesEsperado || actual.anio !== anioEsperado) {
          return false
        }
      }
      return true
    }

    const tresPrimeros = pendientes.slice(0, 3)
    
    if (!sonConsecutivos(tresPrimeros)) {
      alert('Las 3 primeras mensualidades pendientes no son consecutivas')
      return
    }

    const total = tresPrimeros.reduce((s, p) => s + Number(p.cantidad), 0)
    setConfirmTrim({ open: true, ids: tresPrimeros.map(p => p.id), total })
  }

  const confirmarPagoTrimestre = async () => {
    try {
      await api.patch('/pagos/pagar-trimestre', { 
        ids: confirmTrim.ids, 
        idpersonal: personalId 
      })

      const pdfRes = await api.post('/pagos/comprobante-multiple', 
        { ids: confirmTrim.ids }, 
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `comprobante-trimestre-${estudianteSel?.id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setConfirmTrim({ open: false, ids: [], total: 0 })
      setBusquedaTemp("")
      setBusqueda("")
      await loadData()
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al pagar trimestre')
    }
  }

  const handlePagarAnio = async () => {
    if (!estudianteSel) return
    const pendientes = data.pagos
      .filter(p => p.idEstudiante === estudianteSel.id && p.deuda === 'pendiente' && p.tipo === 'mensual')
      .sort((a, b) => a.anio - b.anio || a.mes - b.mes)
      .slice(0, 10)

    if (pendientes.length < 10) {
      alert('No hay 10 mensualidades pendientes para aplicar el descuento anual')
      return
    }
    const total = pendientes.reduce((s, p) => s + Number(p.cantidad), 0)
    setConfirmAnio({ open: true, ids: pendientes.map(p => p.id), total })
  }

const confirmarPagoAnio = async () => {
  try {
    if (!estudianteSel) return;

    // 1. Pagar el año
    await api.patch(`/pagos/estudiante/${estudianteSel.id}/pagar-anio`, {
      idpersonal: personalId,
    });

    // 2. Recargar pagos ANTES de filtrar
    const fresh = await api.get('/pagos');
    const mapNombre = new Map(data.estudiantes.map(e => [e.id, e.label]));
    const mapId   = new Map(data.estudiantes.map(e => [e.id, e.identificacion]));

    const updatedPagos = (fresh.data || []).map((p: any) => ({
      ...p,
      nombreEstudiante: mapNombre.get(p.idEstudiante) || 'Desconocido',
      identificacion: mapId.get(p.idEstudiante),
    }));

    // 3. Ahora sí filtrar los recién cancelados
    const recienPagados = updatedPagos.filter(
      (p) =>
        p.idEstudiante === estudianteSel.id &&
        p.deuda === 'cancelado' &&
        p.tipo === 'mensual' &&
        p.mes !== null
    );

    if (recienPagados.length === 0) {
      alert('No se encontraron pagos cancelados para generar el comprobante');
      return;
    }

    const ids = recienPagados.map((p) => p.id);

    // 4. Generar comprobante
    const pdfRes = await api.post(
      '/pagos/comprobante-multiple',
      { ids },
      { responseType: 'blob' }
    );

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
    const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-anio-${estudianteSel.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    // 5. Actualizar estado local y cerrar
    setData((d) => ({ ...d, pagos: updatedPagos }));
    setConfirmAnio({ open: false, ids: [], total: 0 });
    setBusquedaTemp('');
    setBusqueda('');
  } catch (e: any) {
    alert(e.response?.data?.message || 'Error al pagar año');
  }
};
  const handleCreate = async () => {
    await loadData();
    setShowForm(false);
  };
    await loadData()
    setShowForm(false)
  }

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
          onChange={e => setBusquedaTemp(e.target.value)}
          sx={{ mb: 3 }}
        />

        <div className="flex items-center gap-3 mb-4">
          <Autocomplete
            options={data.estudiantes}
            value={estudianteSel}
            onChange={(e, v) => setEstudianteSel(v)}
            getOptionLabel={(o) => `${o.label} | CI: ${o.identificacion}`}
            filterOptions={(options, { inputValue }) => {
              const q = inputValue.toLowerCase()
              return options.filter(o =>
                o.label.toLowerCase().includes(q) ||
                o.identificacion.toLowerCase().includes(q) ||
                String(o.id).includes(q)
              )
            }}
            renderInput={(params) => (
              <TextField {...params} label="Estudiante (nombre o CI)" sx={{ width: 350 }} />
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

          {rol === "Cajero" && usuarioId && (
            <div>
          <Button variant="outlined" onClick={handlePagarTrimestre} disabled={!estudianteSel}>
            Pagar trimestre
          </Button>
          <Button variant="outlined" onClick={handlePagarAnio} disabled={!estudianteSel}>
            Pagar año
          </Button>
          </div>
          )}

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
        <TablePagos 
          pagos={pagosFiltrados} 
          estudiantes={data.estudiantes} 
          onUpdate={handleUpdate} 
        />

        <Dialog open={confirmTrim.open} onClose={() => setConfirmTrim({ open: false, ids: [], total: 0 })} maxWidth="xs">
          <DialogTitle>Confirmar pago trimestre</DialogTitle>
          <DialogContent>
            <Typography variant="body2">Se cancelarán 3 mensualidades</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Total: {confirmTrim.total}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmTrim({ open: false, ids: [], total: 0 })}>Cancelar</Button>
            <Button variant="contained" onClick={confirmarPagoTrimestre}>Pagar y descargar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmAnio.open} onClose={() => setConfirmAnio({ open: false, ids: [], total: 0 })} maxWidth="xs">
          <DialogTitle>Confirmar pago anual</DialogTitle>
          <DialogContent>
            <Typography variant="body2">Se cancelarán 10 mensualidades</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>Total: {confirmAnio.total}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmAnio({ open: false, ids: [], total: 0 })}>Cancelar</Button>
            <Button variant="contained" onClick={confirmarPagoAnio}>Pagar y descargar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}
