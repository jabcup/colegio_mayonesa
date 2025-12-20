import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateNotificacionesDocentesDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  docente_id: number;

  @IsEnum(['asignacion_curso', 'otro_tipo'])
  @IsOptional() 
  tipo?: 'asignacion_curso' | 'otro_tipo';

  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  asignacion_id?: number;

  @IsEnum(['activo', 'inactivo'])
  @IsOptional()
  estado?: 'activo' | 'inactivo';
}