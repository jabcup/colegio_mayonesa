import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateCalificacionDto {
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

  @ApiProperty({
    example: 2023,
    description: 'Año escolar',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(2000)
  anioEscolar: number;

  @ApiProperty({
    example: 80,
    description: 'Calificación 1 er Trimestre',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  trim1: number;

  @ApiProperty({
    example: 80,
    description: 'Calificación 2do Trimestre',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  trim2: number;

  @ApiProperty({
    example: 80,
    description: 'Calificación 3er Trimestre',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  trim3: number;
}
