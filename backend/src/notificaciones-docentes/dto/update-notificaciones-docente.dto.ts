import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateNotificacionesDocentesDto {
  @IsEnum(['asignacion_curso', 'otro_tipo'])
  @IsOptional()
  tipo?: 'asignacion_curso' | 'otro_tipo';

  @IsString()
  @IsOptional()
  mensaje?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  asignacion_id?: number;

  @IsBoolean()
  @IsOptional()
  leida?: boolean;

  @IsEnum(['activo', 'inactivo'])
  @IsOptional()
  estado?: 'activo' | 'inactivo';
}