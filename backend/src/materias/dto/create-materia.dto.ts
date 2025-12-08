import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMateriaDto {
  @ApiProperty({
    example: 'Física',
    description: 'Asignaturas que se llevan en el colegio',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
