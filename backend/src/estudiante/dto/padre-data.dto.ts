import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PadreDataDto {
  @ApiProperty({ example: 'Carlos', description: 'Nombres del padre' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Gómez', description: 'Apellido paterno del padre' })
  @IsString()
  @IsNotEmpty()
  apellidoPat: string;

  @ApiProperty({
    example: 'Gómez',
    description: 'Apellido materno (opcional)',
    required: false
  })
  @IsOptional() 
  @IsString()
  apellidoMat?: string;

  @ApiProperty({ example: '78965412', description: 'Teléfono del padre' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({
    example: 'carlos.padre@gmail.com',
    description: 'Correo del padre (opcional)',
    required: false,
  })
  @IsString()
  correo?: string;
}
