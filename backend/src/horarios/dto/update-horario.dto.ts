import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateHorarioDto {
    @ApiProperty({
    example: '08:00 - 09:00',
    description: 'Franja horaria que ocupara un periodo de clases',
  })
    @IsOptional()
    @IsString()
    horario?: string;
}
