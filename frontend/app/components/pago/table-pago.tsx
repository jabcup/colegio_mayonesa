"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { api } from "@/app/lib/api";
import DetallePago from "./detalle-pago";
import FormPago from "./form-pago";
import Cookies from "js-cookie";

interface Pago {
  id: number;
  idEstudiante: number;
  nombreEstudiante: string;
  cantidad: number;
  descuento: number;
  total: number;
  deuda: "pendiente" | "cancelado";
  concepto: string;
  fecha_creacion: string;
  estado: "activo" | "inactivo";
}

interface Props {
  pagos: Pago[];
  estudiantes: { id: number; nombres: string; apellidoPat: string }[];
  onUpdate?: () => void | Promise<void>;
}

export default function TablePagos({ pagos, estudiantes, onUpdate }: Props) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [anioFiltro, setAnioFiltro] = useState("");
  const [pagoAEditar, setPagoAEditar] = useState<Pago | undefined>();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [confirm, setConfirm] = useState<{ open: boolean; pagoId: number; total: number }>({
    open: false,
    pagoId: 0,
    total: 0,
  });

  // Estados para ordenamiento
  const [sortBy, setSortBy] = useState<"fecha" | "estudiante">("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // desc = más reciente primero

  const personalId = Number(Cookies.get("personal_id") ?? 0);

  // Filtrado por año y estado activo
  const visibles = pagos.filter((p) => p.estado === "activo");
  const filteredByYear = anioFiltro
    ? visibles.filter((p) => new Date(p.fecha_creacion).getFullYear().toString() === anioFiltro)
    : visibles;

  // Ordenamiento
  const pagosOrdenados = useMemo(() => {
    return [...filteredByYear].sort((a, b) => {
      let comparacion = 0;

      if (sortBy === "fecha") {
        comparacion = new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime();
      } else if (sortBy === "estudiante") {
        comparacion = a.nombreEstudiante.toLowerCase().localeCompare(b.nombreEstudiante.toLowerCase());
      }

      return sortOrder === "asc" ? comparacion : -comparacion;
    });
  }, [filteredByYear, sortBy, sortOrder]);

  // Paginación sobre los pagos ordenados
  const paginated = pagosOrdenados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleVer = async (pagoId: number) => {
    try {
      const { data } = await api.get<Pago>(`/pagos/${pagoId}`);
      setPagoSeleccionado(data);
    } catch {
      alert("Error al cargar detalles");
    }
  };

  const handlePagar = async () => {
    const { pagoId } = confirm;
    try {
      await api.patch(`/pagos/pagar/${pagoId}`, { idpersonal: personalId });

      const pdfRes = await api.get(`/pagos/comprobante/${pagoId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `comprobante-${pagoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setConfirm({ open: false, pagoId: 0, total: 0 });
      await onUpdate?.();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al pagar");
    }
  };

  const handleActualizar = (p: Pago) => setPagoAEditar(p);
  const handleCerrarForm = () => setPagoAEditar(undefined);

  const handleEliminar = async (id: number) => {
    if (typeof window === "undefined" || !window.confirm("¿Confirma eliminar este pago?")) return;
    try {
      await api.delete(`/pagos/eliminar/${id}`);
      alert("Pago eliminado");
      await onUpdate?.();
    } catch (e: any) {
      alert(e.response?.data?.message || "Error al eliminar");
    }
  };

  const handleActualizarYRecargar = async () => {
    handleCerrarForm();
    await onUpdate?.();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Alternar orden
  const toggleSort = (field: "fecha" | "estudiante") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "fecha" ? "desc" : "asc"); // fecha por defecto más reciente
    }
    setPage(0); // reiniciar paginación al cambiar orden
  };

  const getSortIcon = (field: "fecha" | "estudiante") => {
    if (sortBy !== field) return <SortIcon fontSize="small" sx={{ opacity: 0.5 }} />;
    return sortOrder === "asc" ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  return (
    <>
      {/* Filtros y ordenamiento */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", mb: 2 }}>
          <TextField
            label="Filtrar por año"
            type="number"
            placeholder="2025"
            value={anioFiltro}
            onChange={(e) => {
              setAnioFiltro(e.target.value);
              setPage(0);
            }}
            sx={{ width: 160 }}
          />

          <Typography variant="h6" fontWeight="medium">
            Ordenar por:
          </Typography>

          <Button
            variant={sortBy === "fecha" ? "contained" : "outlined"}
            size="small"
            startIcon={getSortIcon("fecha")}
            onClick={() => toggleSort("fecha")}
            sx={{ textTransform: "none" }}
          >
            Fecha
          </Button>

          <Button
            variant={sortBy === "estudiante" ? "contained" : "outlined"}
            size="small"
            startIcon={getSortIcon("estudiante")}
            onClick={() => toggleSort("estudiante")}
            sx={{ textTransform: "none" }}
          >
            Estudiante
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
            Total: {filteredByYear.length} pago{filteredByYear.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estudiante</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Concepto</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cantidad</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descuento</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay pagos que mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.nombreEstudiante}</TableCell>
                  <TableCell>{p.concepto}</TableCell>
                  <TableCell>{new Date(p.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>{p.descuento}</TableCell>
                  <TableCell>{p.total}</TableCell>
                  <TableCell>{p.deuda}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleVer(p.id)}>
                      Ver
                    </Button>
                    {p.deuda === "pendiente" && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => setConfirm({ open: true, pagoId: p.id, total: p.total })}
                        sx={{ ml: 1 }}
                      >
                        Pagar
                      </Button>
                    )}
                    {p.deuda !== "cancelado" && (
                      <Button size="small" onClick={() => handleActualizar(p)} sx={{ ml: 1 }}>
                        Actualizar
                      </Button>
                    )}
                    <Button size="small" color="error" onClick={() => handleEliminar(p.id)} sx={{ ml: 1 }}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagosOrdenados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />

      {/* Modales (sin cambios) */}
      <Dialog open={!!pagoSeleccionado} onClose={() => setPagoSeleccionado(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle del pago
          <IconButton
            aria-label="close"
            onClick={() => setPagoSeleccionado(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {pagoSeleccionado && <DetallePago pago={pagoSeleccionado} onClose={() => setPagoSeleccionado(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!pagoAEditar} onClose={handleCerrarForm} maxWidth="md" fullWidth>
        <DialogTitle>
          Actualizar pago
          <IconButton
            aria-label="close"
            onClick={handleCerrarForm}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {pagoAEditar && (
            <FormPago
              estudiantes={estudiantes.map((e) => ({
                id: e.id,
                label: `${e.nombres} ${e.apellidoPat}`,
                identificacion: undefined,
              }))}
              pagoInicial={pagoAEditar}
              onCreate={handleActualizarYRecargar}
              onClose={handleCerrarForm}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, pagoId: 0, total: 0 })} maxWidth="xs">
        <DialogTitle>Confirmar pago</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Concepto: {pagos.find((p) => p.id === confirm.pagoId)?.concepto}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Total: {confirm.total}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, pagoId: 0, total: 0 })}>Cancelar</Button>
          <Button variant="contained" onClick={handlePagar}>
            Pagar y descargar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}