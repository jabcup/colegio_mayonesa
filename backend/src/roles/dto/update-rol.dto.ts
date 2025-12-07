import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateRolDto {
  @ApiProperty({ example: 'Administrador', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'activo', required: false })
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: 'activo' | 'inactivo';
}
