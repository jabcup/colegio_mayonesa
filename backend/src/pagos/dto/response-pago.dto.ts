import { ApiProperty } from "@nestjs/swagger";

export class PagoResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() idEstudiante: number;
  // @ApiProperty() idPersonal: number;
  @ApiProperty() cantidad: number;
  @ApiProperty() descuento: number;
  @ApiProperty() total: number;
  @ApiProperty() fecha_creacion: Date;
  @ApiProperty() estado: 'activo' | 'inactivo';
}
