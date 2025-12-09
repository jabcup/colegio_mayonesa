import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCalificacionDto {
  @ApiProperty({
    example: 1,
    description: 'Id de la clase Asignada',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idAsignacion: number;

  //   @ApiProperty({
  //     example: 1,
  //     description: 'Id del Estudiante',
  //   })
  //   @IsNotEmpty()
  //   @Type(() => Number)
  //   @IsNumber()
  //   idEstudiante: number;

  @ApiProperty({
    example: '100%',
    description: 'Calificacion del estudiante',
  })
  @IsNotEmpty()
  @IsString()
  calificacion: string;

  @ApiProperty({
    example: true,
    description: 'Aprobación del estudiante',
  })
  @IsNotEmpty()
  @Type(() => Boolean)
  aprobacion: boolean;
}
