import { Controller, Get, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VistaPagosEstudiantesView } from './entity/vista-pagos.entity';
import { VistaPagosPorEstudiante } from './entity/vista-pagos-estudiante.entity';
import { VistaCalificacionesCurso } from './entity/vista-calificaciones-curso.entity';
import { VistaCalificacionesEstudiante } from './entity/vista-calificaciones-estudiante.entity';
import { VistaAsistenciasEstudiante } from './entity/vista-asistencias-estudiante.entity';
import { VistaAsistenciasCurso } from './entity/vista-asistencias-curso.entity';
import { VistaTutoresCurso } from './entity/vista-tutores-curso.entity';
import { VistaEstudiantesCurso } from './entity/vista-estuidantes-curso.entity';

@ApiTags('Reportes')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('PagosPorCurso')
  @ApiOkResponse({
    description: 'Lista de pagos filtrados por curso',
    type: VistaPagosEstudiantesView,
    isArray: true,
  })
  getPagos(
    @Query('curso') curso?: string,
    @Query('estado') estado?: string,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ) {
    return this.reportesService.buscarPagos({
      curso,
      estadoPago: estado,
      mesPago: Number(mes),
      anioPago: Number(anio),
    });
  }

  @Get('PagosPorEstudiante')
  @ApiOkResponse({
    description: 'Historial de pagos de un estudiante',
    type: VistaPagosPorEstudiante,
    isArray: true,
  })
  getPagosPorEstudiante(@Query('idEstudiante') idEstudiante: number) {
    return this.reportesService.buscarPagosPorEstudiante(Number(idEstudiante));
  }

  @Get('CalificacionesPorCurso')
  @ApiOkResponse({
    description: 'Calificaciones de un curso',
    type: VistaCalificacionesCurso,
    isArray: true,
  })
  getCalificacionesPorCurso(
    @Query('curso') curso?: string,
    @Query('paralelo') paralelo?: string,
    @Query('gestion') gestion?: number,
  ) {
    return this.reportesService.buscarCalificacionesPorCurso({
      curso,
      paralelo,
      gestion: Number(gestion),
    });
  }

  @Get('CalificacionesPorEstudiante')
  @ApiOkResponse({
    description: 'Calificaciones totales de un estudiante',
    type: VistaCalificacionesEstudiante,
    isArray: true,
  })
  getCalificacionesPorEstudiante(@Query('idEstudiante') idEstudiante: number) {
    return this.reportesService.buscarCalificacionesPorEstudiante(
      Number(idEstudiante),
    );
  }

  @Get('AsistenciasPorCurso')
  @ApiOkResponse({
    description: 'Asistencias filtradas por curso',
    type: VistaAsistenciasCurso,
    isArray: true,
  })
  getAsistenciasPorCurso(
    @Query('curso') curso?: string,
    @Query('paralelo') paralelo?: string,
    @Query('gestion') gestion?: number,
    @Query('mes') mes?: number,
  ) {
    return this.reportesService.buscarAsistenciasPorCurso({
      curso,
      paralelo,
      gestion: Number(gestion),
      mes: Number(mes),
    });
  }

  @Get('AsistenciaPorEstudiante')
  @ApiOkResponse({
    description: 'Historial de asistencias de un estudiante',
    type: VistaAsistenciasEstudiante,
    isArray: true,
  })
  getAsistenciaPorEstudiante(@Query('idEstudiante') idEstudiante: number) {
    return this.reportesService.buscarAsistenciaPorEstudiante(
      Number(idEstudiante),
    );
  }

  @Get('Tutores')
  @ApiOkResponse({
    description: 'Lista de tutores de los cursos',
    type: VistaTutoresCurso,
    isArray: true,
  })
  getTutores() {
    return this.reportesService.listarTutores();
  }

  @Get('EstudiantesPorCurso')
  @ApiOkResponse({
    description: 'Lista de estudiantes por curso',
    type: VistaEstudiantesCurso,
    isArray: true,
  })
  getEstudiantesPorCurso(
    @Query('curso') curso?: string,
    @Query('paralelo') paralelo?: string,
    @Query('gestion') gestion?: number,
  ) {
    return this.reportesService.buscarEstudiantesPorCurso({
      curso,
      paralelo,
      gestion: Number(gestion),
    });
  }
}
