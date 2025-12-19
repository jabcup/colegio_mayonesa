// dto/update-calificacion.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateCalificacionDto {
  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  trim1?: number;

  @ApiPropertyOptional({ example: 90.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  trim2?: number;

  @ApiPropertyOptional({ example: 78.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  trim3?: number;
}
