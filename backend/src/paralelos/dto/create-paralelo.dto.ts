import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParaleloDto {
  @ApiProperty({
    example: 'A',
    description: 'Letra del paralelo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
