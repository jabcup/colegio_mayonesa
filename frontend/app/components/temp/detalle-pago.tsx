import { Button } from "@mui/material";

interface Props {
  pago: {
    id: number;
    idEstudiante: number;
    nombreEstudiante: string;
    cantidad: number | string;
    descuento: number | string;
    total: number | string;
    fecha_creacion: string;
    estado: "activo" | "inactivo";
    deuda: "pendiente" | "cancelado";
    concepto: string;
  };
  onClose: () => void;
}

export default function DetallePago({ pago, onClose }: Props) {
  return (
    <div className="p-4 max-w-md border rounded">
      <h2 className="text-xl mb-4">Detalle del Pago</h2>

      <div className="space-y-2">
        <p><strong>ID:</strong> {pago.id}</p>
        <p><strong>Estudiante:</strong> {pago.nombreEstudiante}</p>
        <p><strong>Concepto:</strong> {pago.concepto}</p>
        <p><strong>Cantidad:</strong> {Number(pago.cantidad).toFixed(2)}</p>
        <p><strong>Descuento:</strong> {Number(pago.descuento).toFixed(2)}</p>
        <p><strong>Total:</strong> {Number(pago.total).toFixed(2)}</p>
        <p><strong>Fecha:</strong> {new Date(pago.fecha_creacion).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Deuda:</strong> {pago.deuda}</p>
      </div>

      <Button variant="outlined" onClick={onClose} className="mt-4">
        Cerrar
      </Button>
    </div>
  );
}
