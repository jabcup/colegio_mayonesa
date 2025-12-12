import { Button } from "@mui/material";

interface Props {
  pago: {
    id: number;
    idEstudiante: number;
    nombreEstudiante: string;
    cantidad: string;
    descuento: string;
    total: string;
    fecha_creacion: string;
    estado: string;
  }
  onClose: () => void;
}

export default function DetallePago({ pago, onClose }: Props) {
  return (
    <div className="p-4 max-w-md border rounded">
      <h2 className="text-xl mb-4">Detalle del Pago</h2>
      
      <div className="space-y-2">
        <p><strong>ID:</strong> {pago.id}</p>
        <p><strong>Estudiante:</strong> {pago.nombreEstudiante}</p>
        <p><strong>Cantidad:</strong> {pago.cantidad}</p>
        <p><strong>Descuento:</strong> {pago.descuento}</p>
        <p><strong>Total:</strong> {pago.total}</p>
        <p><strong>Fecha:</strong> {new Date(pago.fecha_creacion).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
      </div>

      <Button variant="outlined" onClick={onClose} className="mt-4">
        Cerrar
      </Button>
    </div>
  )
}
