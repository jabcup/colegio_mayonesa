import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCursoDto {
  @ApiProperty({
    example: 'Primero Secundaria',
    description: 'Nombre del curso',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 1,
    description: 'Id del Paralelo',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idParalelo: number;

  // @ApiProperty({
  //   example: 'A',
  //   description: 'Paralelo del curso',
  // })
  // @IsNotEmpty()
  // @IsString()
  // paralelo: string;

  @ApiProperty({
    example: 2024,
    description: 'Gestión del curso',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  gestion: number;

  @ApiProperty({
    example: 30,
    description: 'Capacidad del curso',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  capacidad: number;
}
