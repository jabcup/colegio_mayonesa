import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContrasenaUsuarioDto {
  @ApiProperty({
    example: 'clave123',
    description: 'Clave del usuario',
  })
  @IsNotEmpty()
  @IsString()
  contrasena: string;
}
