import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  idEstudiante: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  idPersonal: number;

  @ApiProperty({ example: 120.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cantidad: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  descuento: number;

  @ApiProperty({ example: 110.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @ApiProperty({ example: 'pendiente' })
  @IsEnum(['pendiente', 'cancelado'])
  deuda: 'pendiente' | 'cancelado';

  @ApiProperty({ example: 'Matrícula abril' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  concepto: string;
}
