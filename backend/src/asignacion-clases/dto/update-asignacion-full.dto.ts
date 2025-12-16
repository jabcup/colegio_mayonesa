import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAsignacionFulDto {
  @ApiProperty({
    example: 'Lunes',
    description: 'Dia de la semana',
  })
  @IsNotEmpty()
  @IsString()
  dia: string;

  @ApiProperty({
    example: 1,
    description: 'Id del Personal (Docente)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idPersonal: number;

  @ApiProperty({
    example: 1,
    description: 'Id del Curso',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idCurso: number;

  @ApiProperty({
    example: 1,
    description: 'Id de Materia',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idMateria: number;

  @ApiProperty({
    example: 1,
    description: 'Id de Horario',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idHorario: number;
}
