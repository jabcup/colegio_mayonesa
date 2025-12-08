import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @ApiProperty({
    example: 'juan pérez.pérez@mayonesa.com',
    description: 'correo institucional',
  })
  @IsNotEmpty()
  @IsString()
  correo_institucional: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  @IsString()
  contrasena: string;
}
