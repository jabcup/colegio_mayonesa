import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateAvisosDto {
  @IsOptional()
  @IsInt()
  idCurso?: number;

  @IsOptional()
  @IsInt()
  idPersonal?: number;

  @IsOptional()
  @IsString()
  asunto?: string;

  @IsOptional()
  @IsString()
  mensaje?: string;
}