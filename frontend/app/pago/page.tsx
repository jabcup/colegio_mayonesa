// app/pagos/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@mui/material"
import TablePagos from "@/app/components/pago/table-pago"
import FormPago from "@/app/components/pago/form-pago"
import { api } from "@/app/lib/api"

// Función para traer datos (ahora cliente)
async function getPagos() {
  const [pagosRes, estudiantesRes] = await Promise.all([
    api.get('/pagos'),
    api.get('/estudiante/MostrarEstudiantes')
  ]);
  
  const pagos = pagosRes.data;
  const estudiantes = estudiantesRes.data;
  
  const estudiantesMap = new Map(
    estudiantes.map(est => [est.id, {nombre: est.nombres, identificacion: est.identificacion}])
  );
  
  return {
    pagos: pagos.map(pago => ({
      ...pago,
      nombreEstudiante: estudiantesMap.get(pago.idEstudiante)?.nombre || 'Desconocido',
      identificacion: estudiantesMap.get(pago.idEstudiante)?.identificacion || 'Sin CI'
    })),
    estudiantes
  };
}

export default function PagosPage() {
  const [showForm, setShowForm] = useState(false)
  
  // Traemos datos con useEffect
  const [data, setData] = useState({ pagos: [], estudiantes: [] })
  
  useEffect(() => {
    getPagos().then(setData)
  }, [])

  const handleCreate = async () => {
    // Recarga datos después de crear
    const freshData = await getPagos()
    setData(freshData)
    setShowForm(false)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Button 
          variant="contained"
          onClick={() => setShowForm(true)}
        >
          Nuevo Pago
        </Button>
      </div>

      {showForm && (
        <FormPago 
          estudiantes={data.estudiantes}
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      <TablePagos pagos={data.pagos} />
    </div>
  )
}
