import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePersonalDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombres del personal',
  })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido paterno del personal',
  })
  @IsNotEmpty()
  @IsString()
  apellidoPat: string;

  @ApiProperty({
    example: 'Gómez',
    description: 'Apellido materno del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  apellidoMat?: string;

  @ApiProperty({
    example: '77896577',
    description: 'Teléfono del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    example: '12345678',
    description: 'Identificación del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  identificacion?: string;

  @ApiProperty({
    example: 'Calle Miraflores',
    description: 'Dirección del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    example: 'ejemplo@correo.com',
    description: 'Correo del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  correo?: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Fecha de nacimiento del personal (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_nacimiento?: Date;

  @IsInt()
  idRol: number;
}
