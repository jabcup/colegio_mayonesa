import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUsuarioCompletoDto {
  @ApiProperty({
    example: 'juan.perez@mayo.com',
    description: 'Correo Institucional del usuario',
  })
  @IsNotEmpty()
  @IsString()
  correo_institucional: string;

  @ApiProperty({
    example: 'clave123',
    description: 'Clave del usuario',
  })
  @IsNotEmpty()
  @IsString()
  contrasena: string;
}
