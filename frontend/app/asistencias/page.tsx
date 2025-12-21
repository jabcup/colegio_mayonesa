// app/asistencias/page.tsx
import { Suspense } from 'react';
import AsistenciaTable from '@/components/table-asistencia';
import AsistenciaForm from '@/components/form-asistencia';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AsistenciasPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Asistencias</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Nueva Asistencia Individual</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Asistencia</DialogTitle>
            </DialogHeader>
            <AsistenciaForm />
          </DialogContent>
        </Dialog>
      </div>

      <Suspense fallback={<p>Cargando asistencias...</p>}>
        <AsistenciaTable />
      </Suspense>

      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <a href="/asistencias/lote">Registrar por Lote</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/asistencias/historial">Ver Historial</a>
        </Button>
      </div>
    </div>
  );
}