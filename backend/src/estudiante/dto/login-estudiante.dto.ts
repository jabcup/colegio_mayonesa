import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginEstudianteDto {
  @ApiProperty({
    example: 'ignacio.pérez@mayonesa.estudiante.edu.bo',
    description: 'correo institucional',
  })
  @IsNotEmpty()
  @IsString()
  correo_institucional: string;
  @ApiProperty({
    example: 'R12345678IPG',
    description: 'rude',
  })
  @IsNotEmpty()
  @IsString()
  rude: string;
}
