import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateEstudianteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apellidoPat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apellidoMat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  identificacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono_referencia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sexo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nacionalidad?: string;
}
