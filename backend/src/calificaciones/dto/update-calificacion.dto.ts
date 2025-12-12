import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCalificacionDto {
  @ApiProperty({
    example: 100,
    description: 'Calificacion del estudiante',
  })
  @IsNotEmpty()
  @IsNumber()
  calificacion: number;
}
