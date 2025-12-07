import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del rol',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
