import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCorreoUsuarioDto {
  @ApiProperty({
    example: 'juan.perez@mayo.com',
    description: 'Corre Institucional del usuario',
  })
  @IsNotEmpty()
  @IsString()
  correo_institucional: string;
}
