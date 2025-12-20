import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  Button,
  Tab,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useState } from "react";
import { api } from "@/app/lib/api";

interface Auditoria {
  id: number;
  tabla: string;
  operacion: string;
  idRegistro: number;
  datosAntes: DatosAntes;
  datosDespues: DatosDespues;
  usuarioId: number;
  fecha_registro: string;
}

interface DatosAntes {
  nombre: string;
  gestion: number;
  paralelo: string;
  capacidad: number;
}

interface DatosDespues {
  id: number;
  estado: string;
  nombre: string;
  gestion: number;
  paralelo: string;
  capacidad: number;
  fechaCreacion: string;
}

interface Props {
  auditorias: Auditoria[];
  loading: boolean;
}

export default function TablaAuditoria({ auditorias, loading }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const auditoriasPaginadas = auditorias.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //Modal de los Jsons
  const [openJson, setOpenJson] = useState(false);
  const [jsonData, setJsonData] = useState<any>(null);
  const [jsonTitle, setJsonTitle] = useState("");

  const abrirJson = (titulo: string, data: any) => {
    setJsonTitle(titulo);
    setJsonData(data);
    setOpenJson(true);
  };

  if (loading) return <CircularProgress />;

  if (auditorias.length === 0)
    return <Typography>No hay registros de auditoría.</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tabla</TableCell>
            <TableCell>Operación</TableCell>
            <TableCell>ID Registro</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Datos Antes</TableCell>
            <TableCell>Datos Después</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditoriasPaginadas.map((aud) => (
            <TableRow key={aud.id}>
              <TableCell>{aud.id}</TableCell>
              <TableCell>{aud.tabla}</TableCell>
              <TableCell>{aud.operacion}</TableCell>
              <TableCell>{aud.idRegistro ?? "-"}</TableCell>
              <TableCell>{aud.usuarioId}</TableCell>
              <TableCell>
                {new Date(aud.fecha_registro).toLocaleString()}
              </TableCell>
              <TableCell>
                {aud.datosAntes ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => abrirJson("Datos Antes", aud.datosAntes)}
                  >
                    Ver
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell>
                {aud.datosDespues ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => abrirJson("Datos Después", aud.datosDespues)}
                  >
                    Ver
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={auditorias.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 5));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Dialog
        open={openJson}
        onClose={() => setOpenJson(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{jsonTitle}</DialogTitle>
        <DialogContent dividers>
          <pre
            style={{
              maxHeight: "400px",
              overflow: "auto",
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJson(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
