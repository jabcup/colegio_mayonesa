<<<<<<< HEAD
import { Body, Controller, Delete, Post, Put, Param } from '@nestjs/common';
=======
import { Body, Controller, Get, Delete, Post, Put, Param} from '@nestjs/common';
>>>>>>> charu
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciaService: AsistenciasService) {}

    @Get('VerAsistencias')
    @ApiOperation({ summary: 'Ver Asistencias' })
    async getAsistencias() {
        return this.asistenciaService.getAsistencias();
    }

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

  @Put('ActualizarAsistencia/:id')
  @ApiOperation({ summary: 'Actualizar Asistencia' })
  async updateAsistencia(
    @Param('id') id: number,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    const asistencia = await this.asistenciaService.updateAsistencia(
      id,
      updateAsistenciaDto,
    );
    return {
      message: 'Asistencia actualizada exitosamente',
      asistencia,
    };
  }

  @Delete('EliminarAsistencia/:id')
  @ApiOperation({ summary: 'Eliminar Asistencia' })
  removeAsistencia(@Param('id') id: number) {
    return this.asistenciaService.remove(id);
  }
}
