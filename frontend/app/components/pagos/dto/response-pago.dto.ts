import { ApiProperty } from '@nestjs/swagger';
import { Mes, TipoPago } from '../pagos.entity';
export class PagoResponseDto {
@ApiProperty() id: number;
@ApiProperty() idEstudiante: number;
@ApiProperty() idPersonal: number | null;
@ApiProperty() cantidad: number;
@ApiProperty() descuento: number;
@ApiProperty() total: number;
@ApiProperty() deuda: 'pendiente' | 'cancelado';
@ApiProperty() concepto: string;
@ApiProperty() fecha_creacion: Date;
@ApiProperty() fecha_pago: Date | null;
@ApiProperty() estado: 'activo' | 'inactivo';
@ApiProperty() anio: number | null;
@ApiProperty() mes: Mes | null;
@ApiProperty() tipo: TipoPago;
}
