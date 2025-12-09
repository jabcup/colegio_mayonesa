import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificacionesDto {
    @ApiProperty({
        example: 1,
        description: 'ID del estudiante al que se le envía la notificación',
    })
    @IsNotEmpty()
    idEstudiante: number;

    @ApiProperty({
        example: 2,
        description: 'ID del personal que envía la notificación',
    })
    @IsNotEmpty()
    idPersonal: number;

    @ApiProperty({
        example: 'Entrega de Notas',
        description: 'Asunto de la notificación',
    })
    @IsNotEmpty()
    @IsString()
    asunto: string;

    @ApiProperty({
        example: 'Las notas del semestre han sido publicadas.',
        description: 'Mensaje de la notificación',
    })
    @IsNotEmpty()
    @IsString()
    mensaje: string;

}