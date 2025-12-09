import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTutoresDto {
  @ApiProperty({
    example: 1,
    description: 'Id del Personal',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idPersonal: number;

  @ApiProperty({
    example: 1,
    description: 'Id del Curso',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idCurso: number;
}
