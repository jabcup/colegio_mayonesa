import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PadreDataDto } from './padre-data.dto';

export class CreateEstudianteFullDto {
  // Padre existente (opcional)
  @ApiProperty({
    example: 1,
    description: 'Id del Padre (solo si ya existe)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idPadre?: number;

  // Crear padre nuevo (opcional)
  @ApiProperty({
    description: 'Datos del padre si se desea crear uno nuevo',
    required: false,
    type: () => PadreDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PadreDataDto)
  padreData?: PadreDataDto;

  // Curso
  @ApiProperty({
    example: 1,
    description: 'Id del Curso',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idCurso: number;

  // Datos del Estudiante
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  apellidoPat: string;

  @ApiProperty({ example: 'Gómez' })
  @IsNotEmpty()
  @IsString()
  apellidoMat: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  identificacion: string;

  @ApiProperty({ example: 'ejemplo@correo.com' })
  @IsString()
  correo: string;

  @ApiProperty({ example: 'Calle Miraflores' })
  @IsString()
  direccion: string;

  @ApiProperty({ example: '77896577' })
  @IsString()
  telefono_referencia: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsDate()
  @Type(() => Date)
  fecha_nacimiento: Date;

  @ApiProperty({ example: 'masculino' })
  @IsString()
  sexo: string;

  @ApiProperty({ example: 'boliviana' })
  @IsString()
  nacionalidad: string;

  @ApiProperty({ example: 'Padre', description: 'Relación con el estudiante' })
  @IsString()
  relacion: string;
}
