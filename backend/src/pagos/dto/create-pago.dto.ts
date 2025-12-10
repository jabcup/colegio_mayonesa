import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({ example: 1, description: 'Id del estudiante que paga' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  idEstudiante: number;

  @ApiProperty({ example: 3, description: 'Id del personal que registra el pago' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  idPersonal: number;

  @ApiProperty({ example: 120.5, description: 'Monto base del pago' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cantidad: number;

  @ApiProperty({ example: 10, description: 'Descuento aplicado' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  descuento: number;

  @ApiProperty({ example: 110.5, description: 'Total a pagar (cantidad - descuento)' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;
}
