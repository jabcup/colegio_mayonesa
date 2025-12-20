import { ApiProperty } from '@nestjs/swagger';
import {
IsEnum,
IsNotEmpty,
IsNumber,
IsString,
MaxLength,
Min,
MinLength,
IsOptional,
IsInt,
Max,
} from 'class-validator';
import { Mes, TipoPago } from '../pagos.entity';
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
@ApiProperty({ example: 0 })
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
@ApiProperty({ example: 2025, required: false })
@IsOptional()
@IsInt()
anio?: number;
@ApiProperty({ example: 4, required: false })
@IsOptional()
@IsInt()
@Min(1)
@Max(12)
mes?: Mes;
@ApiProperty({ example: 'mensual', required: false })
@IsOptional()
@IsEnum(['mensual', 'trimestral'])
tipo?: TipoPago;
}
