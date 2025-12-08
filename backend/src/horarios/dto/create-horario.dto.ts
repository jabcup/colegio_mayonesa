import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateHorarioDto {
  @ApiProperty({
    example: '08:00 - 09:00',
    description: 'Franja horaria que ocupara un periodo de clases',
  })
  @IsNotEmpty()
  @IsString()
  horario: string;
}
