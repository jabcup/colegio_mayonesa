import { Body, Controller, Post } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciasController {
    constructor(private readonly asistenciaService: AsistenciasService) { }

    @Post('CrearAsistencia')
    @ApiOperation({ summary: 'Crear Asistencia' })
    async createAsistencia(
        @Body() CreateAsistenciaDto: CreateAsistenciaDto,
    ) {
        const asistencia = await this.asistenciaService.createAsistencia(
            CreateAsistenciaDto,
        );
        return{
            message: 'Asistencia creada exitosamente',
            asistencia,
        }
    }
}
