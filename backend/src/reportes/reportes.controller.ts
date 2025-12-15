import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ReportesService,
  CalificacionReporte,
  CalificacionEstudianteReporte,
  PagoCursoReporte,
  PagoPorEstudianteReporte,
  AsistenciaCursoReporte,
  AsistenciaEstudianteReporte,
  TutorCursoReporte,
  EstudianteCursoReporte,
} from './reportes.service';
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
    @Query('idCurso') idCurso?: number,
    @Query('estado') estado?: string,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ) {
    return this.reportesService.buscarPagos({
      idCurso: Number(idCurso),
      estadoPago: estado,
      mesPago: Number(mes),
      anioPago: Number(anio),
    });
  }

  @Get('PagosPorCurso/pdf')
  @ApiOkResponse({
    description: 'Descarga de pagos filtrados por curso',
    type: VistaPagosEstudiantesView,
    isArray: true,
  })
  async getPagosPorCursoPdf(
    @Res() res: Response,
    @Query('idCurso') idCurso?: number,
    @Query('estado') estado?: string,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ) {
    const datosRaw = await this.reportesService.buscarPagos({
      idCurso: Number(idCurso),
      estadoPago: estado,
      mesPago: Number(mes),
      anioPago: Number(anio),
    });

    const datosPdf: PagoCursoReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      curso: d.curso,
      paralelo: d.paralelo,
      mesPago: d.mesPago,
      anioPago: d.anioPago,
      total: d.total,
      estadoPago: d.estadoPago,
    }));

    const pdfBuffer = await this.reportesService.generarPdfPagos(datosPdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=pagos.pdf');
    res.send(pdfBuffer);
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

  @Get('PagosPorEstudiante/pdf')
  @ApiOkResponse({
    description: 'Historial de pagos de un estudiante',
    type: VistaPagosPorEstudiante,
    isArray: true,
  })
  async getPagosPorEstudiantePdf(
    @Res() res: Response,
    @Query('idEstudiante') idEstudiante: number,
  ) {
    const datosRaw = await this.reportesService.buscarPagosPorEstudiante(
      Number(idEstudiante),
    );

    const datosPDF: PagoPorEstudianteReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
      total: d.total,
      estadoPago: d.estadoPago,
      fecha_creacion: d.fecha_creacion,
    }));

    const pdfBuffer =
      await this.reportesService.generarPdfPagosPorEstudiante(datosPDF);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=pagos.pdf');
    res.send(pdfBuffer);
  }

  // Get normal de Calificaciones por Curso
  @Get('CalificacionesPorCurso')
  @ApiOkResponse({
    description: 'Calificaciones de un curso',
    type: VistaCalificacionesCurso,
    isArray: true,
  })
  getCalificacionesPorCurso(@Query('idCurso') idCurso?: number) {
    return this.reportesService.buscarCalificacionesPorCurso({
      idCurso: Number(idCurso),
    });
  }

  // Get para descargar PDF de Calificaciones por Curso
  @Get('CalificacionesPorCurso/pdf')
  async getCalificacionesPorCursoPdf(
    @Res() res: Response,
    @Query('idCurso') idCurso?: number,
  ) {
    const datos: CalificacionReporte[] =
      await this.reportesService.buscarCalificacionesPorCurso({
        idCurso: Number(idCurso),
      });

    // Generar PDF
    const pdfBuffer =
      await this.reportesService.generarPdfCalificacionesCurso(datos);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=calificaciones.pdf',
    );
    res.send(pdfBuffer);
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

  // Get PDF para Calificacion por Estudiante
  @Get('CalificacionesPorEstudiante/pdf')
  @ApiOkResponse({
    description: 'Calificaciones totales de un estudiante',
    type: VistaCalificacionesEstudiante,
    isArray: true,
  })
  async getCalificacionesPorEstudiantePdf(
    @Res() res: Response,
    @Query('idEstudiante') idEstudiante: string, // siempre llega como string
  ) {
    // 🔹 Validación y conversión
    const id = Number(idEstudiante);
    if (isNaN(id)) {
      throw new BadRequestException('idEstudiante debe ser un número válido');
    }

    // 🔹 Obtener datos del service
    const datosRaw =
      await this.reportesService.buscarCalificacionesPorEstudiante(id);

    // 🔹 Transformar a la interfaz de reporte
    const datosPdf: CalificacionEstudianteReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
      materia: d.materia,
      calificacion: Number(d.calificacion),
      estado: d.estado,
    }));

    // 🔹 Generar PDF con estilo uniforme
    const pdfBuffer =
      await this.reportesService.generarPdfCalificacionesPorEstudiante(
        datosPdf,
      );

    // 🔹 Enviar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=calificaciones.pdf',
    );
    res.send(pdfBuffer);
  }

  @Get('AsistenciasPorCurso')
  @ApiOkResponse({
    description: 'Asistencias filtradas por curso',
    type: VistaAsistenciasCurso,
    isArray: true,
  })
  getAsistenciasPorCurso(
    @Query('idCurso') idCurso?: number,
    @Query('mes') mes?: number,
  ) {
    return this.reportesService.buscarAsistenciasPorCurso({
      idCurso: Number(idCurso),
      mes: Number(mes),
    });
  }

  @Get('AsistenciasPorCurso/pdf')
  @ApiOkResponse({
    description: 'Asistencias filtradas por curso',
    type: VistaAsistenciasCurso,
    isArray: true,
  })
  async getAsistenciasPorCursoPdf(
    @Res() res: Response,
    @Query('idCurso') idCurso?: number,
    @Query('mes') mes?: number,
  ) {
    const datosRaw = await this.reportesService.buscarAsistenciasPorCurso({
      idCurso: Number(idCurso),
      mes: Number(mes),
    });

    const datosPDF: AsistenciaCursoReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
      fecha: d.fecha,
      estado_asistencia: d.estado_asistencia,
    }));

    const pdfBuffer =
      await this.reportesService.generarPdfAsistenciasPorCurso(datosPDF);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=asistencias.pdf',
    );
    res.send(pdfBuffer);
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

  @Get('AsistenciaPorEstudiante/pdf')
  @ApiOkResponse({
    description: 'Historial de asistencias de un estudiante',
    type: VistaAsistenciasEstudiante,
    isArray: true,
  })
  async getAsistenciaPorEstudiantePdf(
    @Res() res: Response,
    @Query('idEstudiante') idEstudiante: number,
  ) {
    const datosRaw = await this.reportesService.buscarAsistenciaPorEstudiante(
      Number(idEstudiante),
    );

    const datosPDF: AsistenciaEstudianteReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
      fecha: d.fecha,
      estado_asistencia: d.estado_asistencia,
    }));

    const pdfBuffer =
      await this.reportesService.generarPdfAsistenciasPorEstudiante(datosPDF);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=asistencias.pdf',
    );
    res.send(pdfBuffer);
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

  @Get('Tutores/pdf')
  @ApiOkResponse({
    description: 'Lista de tutores de los cursos',
    type: VistaTutoresCurso,
    isArray: true,
  })
  async getTtoresPdf(@Res() res: Response) {
    const datosRaw = await this.reportesService.listarTutores();

    const datosPDF: TutorCursoReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
      tutor_completo: d.tutor_completo,
      telefono: d.telefono,
      correo: d.correo,
    }));

    const pdfBuffer =
      await this.reportesService.generarPdfTutoresPorCurso(datosPDF);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tutores.pdf');
    res.send(pdfBuffer);
  }

  @Get('EstudiantesPorCurso')
  @ApiOkResponse({
    description: 'Lista de estudiantes por curso',
    type: VistaEstudiantesCurso,
    isArray: true,
  })
  getEstudiantesPorCurso(@Query('idCurso') idCurso?: number) {
    return this.reportesService.buscarEstudiantesPorCurso({
      idCurso,
    });
  }

  @Get('EstudiantesPorCurso/pdf')
  @ApiOkResponse({
    description: 'Lista de estudiantes por curso',
    type: VistaEstudiantesCurso,
    isArray: true,
  })
  async getEstudiantesPorCursoPdf(
    @Res() res: Response,
    @Query('idCurso') idCurso?: number,
  ) {
    const datosRaw = await this.reportesService.buscarEstudiantesPorCurso({
      idCurso,
    });
    const datosPdf: EstudianteCursoReporte[] = datosRaw.map((d) => ({
      numero: d.numero,
      estudiante: d.estudiante,
      identificacion: d.identificacion,
      rude: d.rude,
      correo_institucional: d.correo_institucional,
      telefono_referencia: d.telefono_referencia,
      curso: d.curso,
      paralelo: d.paralelo,
      gestion: d.gestion,
    }));

    const pdfBuffer =
      await this.reportesService.generarPdfEstudiantesPorCurso(datosPdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=estudiantes.pdf',
    );
    res.send(pdfBuffer);
  }
}
