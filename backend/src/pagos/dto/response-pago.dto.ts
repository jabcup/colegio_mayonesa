import { ApiProperty } from "@nestjs/swagger";

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
  @ApiProperty() estado: 'activo' | 'inactivo';
}
