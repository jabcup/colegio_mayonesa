"use client";

import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, MenuItem, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api"; 

interface Pago{
  id: number;
  idEstudiante: number,
  nombreEstudiante: string,
  apellidoPat: string,
  identificacion: string,
  cantidad: number,
  descuento: number,
  total: number
}

interface Props {
  pagos: Pago[]
}

export default function TablePagos({ pagos }: Props){
  return(
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Identificacion</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.nombreEstudiante} {p.apellidoPat}
                </TableCell>
                <TableCell>{p.identificacion}</TableCell>
                <TableCell>{p.cantidad}</TableCell>
                <TableCell>{p.descuento}</TableCell>
                <TableCell>{p.total}</TableCell>
                <TableCell>


                <Button 
                  variant="outlined" 
                  size="small"
                  component="span"
                  onClick={() => alert(`Ver ${p.id}`)}
                >
                  Ver
                </Button>
<Button 
  variant="outlined" 
  size="small" 
  color="success"
  onClick={async () => {
    try {
      await api.patch(`/pagos/pagar/${p.id}`, {
        idpersonal: 6  
      });
      alert("Pago realizado");
      window.location.reload();
    } catch (error) {
      console.log(p.id);
      alert("Error al pagar");
      console.error(error);
    }
  }}
  sx={{ ml: 1 }}
>
  Pagar
</Button>            
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
