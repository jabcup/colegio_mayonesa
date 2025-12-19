import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateCalificacionDto {
  // @ApiProperty({
  //   example: 1,
  //   description: 'Id de la clase Asignada',
  // })
  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // idAsignacion: number;

  @ApiProperty({
    example: 1,
    description: 'Id de la Materia',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idMateria: number;

  @ApiProperty({
    example: 1,
    description: 'Id del Estudiante',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idEstudiante: number;

  // @ApiProperty({
  //   example: 1,
  //   description: 'Primer Trimestre',
  // })
  // @IsNotEmpty()
  // @Type(() => Number)
  // @Min(1)
  // @Max(3)
  // @IsNumber()
  // trimestre: number;

  // @ApiProperty({
  //   example: 2023,
  //   description: 'Año escolar',
  // })
  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(2000)
  // anioEscolar: number;

  @ApiProperty({
    example: 100,
    description: 'Calificacion del estudiante',
  })
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @IsNumber()
  calificacion: number;
}
