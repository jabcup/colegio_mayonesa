import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';

@Controller('asignacion-clases')
export class AsignacionClasesController {
  constructor(private readonly asignacionService: AsignacionClasesService) {}

  @Post('CrearAsignacion')
  @ApiOperation({ summary: 'Crear Asignacion' })
  async createAsignacion(
    @Body() CreateAsignacionFullDto: CreateAsignacionFulDto,
  ) {
    const asignacion = await this.asignacionService.createAsignacionFull(
      CreateAsignacionFullDto,
    );
    return {
      message: 'Asignacion creada exitosamente',
      asignacion,
    };
  }

  @Get('por-docente/:idDocente')
  async getCursosPorDocente(@Param('idDocente') idDocente: number) {
    return this.asignacionService.getCursosPorDocente(Number(idDocente));
  }

  @Get('materias-por-docente-curso/:idDocente/:idCurso')
  async getMateriasPorDocenteYCurso(
    @Param('idDocente') idDocente: number,
    @Param('idCurso') idCurso: number,
  ) {
    return this.asignacionService.getMateriasPorDocenteYCurso(
      Number(idDocente),
      Number(idCurso),
    );
  }

  @Get('estudiante/:id')
  @ApiOperation({
    summary: 'Obtener asignaciones de clase por ID de estudiante',
  })
  getPorEstudiante(@Param('id') id: number) {
    return this.asignacionService.getAsignacionesPorEstudiante(id);
  }
}
