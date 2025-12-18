import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePersonalDto {
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
    description: 'Apellido materno del personal',
  })
  @IsNotEmpty()
  @IsString()
  apellidoMat: string;

  @ApiProperty({
    example: '77896577',
    description: 'Teléfono del personal',
  })
  @IsString()
  telefono: string;

  @ApiProperty({
    example: '12345678',
    description: 'Identificación del personal',
  })
  @IsString()
  identificacion: string;

  @ApiProperty({
    example: 'Calle Miraflores',
    description: 'Dirección del personal',
  })
  @IsString()
  direccion: string;

  @ApiProperty({
    example: 'ejemplo@correo.com',
    description: 'Correo del personal',
  })
  @IsString()
  correo: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Fecha de nacimiento del personal',
  })
  @IsDate()
  @Type(() => Date)
  fecha_nacimiento: Date;
}
