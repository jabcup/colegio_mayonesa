import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAsistenciaDto {
    @ApiProperty({
        example: 1,
        description: 'Asignación de Clases'
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    idAsignacion: number;

    @ApiProperty({
        example: 1,
        description: 'Id del Estudiante'
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    idEstudiante: number;

    @ApiProperty({
        example: 'presente',
        description: 'presente/falta/ausente/justificativo'
    })
    @IsNotEmpty()
    @IsString()
    asistencia: string;
}