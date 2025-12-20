import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAvisosDto {
  @IsNotEmpty()
  @IsInt()
  idCurso: number;

  @IsNotEmpty()
  @IsInt()
  idPersonal: number;

  @IsNotEmpty()
  @IsString()
  asunto: string;

  @IsNotEmpty()
  @IsString()
  mensaje: string;
}