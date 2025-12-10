import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePadreEstudianteDto {
  @ApiProperty({
    example: '1',
    description: 'id estudiante',
  })
  @IsNotEmpty()
  @IsNumber()
  idEstudiante: number;

  @ApiProperty({
    example: '1',
    description: 'id Tutor',
  })
  @IsNotEmpty()
  @IsNumber()
  idTutor: number;

  @ApiProperty({
    example: 'padre',
    description: 'relacion del tutor',
  })
  @IsNotEmpty()
  @IsString()
  relacion: string;
}
