import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEstudianteFullDto {
  @ApiProperty({
    example: 1,
    description: 'Id del Estudiante',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idEstudiante: number;

  @ApiProperty({
    example: 1,
    description: 'Id del Curso',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idCurso: number;
}
