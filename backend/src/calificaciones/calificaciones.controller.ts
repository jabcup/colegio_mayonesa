import {
  Body,
  Controller,
  Get,
  Post,
  // Put,
  Delete,
  Param,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
// import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { CalificacionesService } from './calificaciones.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Public } from 'src/auth/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Get('ListarCalificaciones')
  @ApiOperation({ summary: 'Listar calificaciones' })
  async getCalificaciones() {
    const calificaciones = await this.calificacionesService.getCalificaciones();
    return {
      message: 'Lista de Califiaciones',
      calificaciones,
    };
  }

  @Get('BuscarCalificacionesAsignacion/:id')
  @ApiOperation({ summary: 'Buscar calificaciones por asignacion' })
  async getCalificacionesPorAsignacion(@Param('id') id: number) {
    const calificaciones =
      await this.calificacionesService.getCalificacionesPorAsignacion(id);
    return {
      message: 'Calificaciones por asignacion',
      calificaciones,
    };
  }

  @Get('BuscarCalificacionesEstudiante/:id')
  @ApiOperation({ summary: 'Buscar calificaciones por estudiante' })
  async getCalificacionesPorEstudiante(@Param('id') id: number) {
    const calificaciones =
      await this.calificacionesService.getCalificacionesPorEstudiante(id);
    return {
      message: 'Calificaciones por estudiante',
      calificaciones,
    };
  }

  @Get('BuscarCalificacionesPorCursoYMateria/:idCurso/:idMateria')
  @ApiOperation({ summary: 'Buscar calificaciones por curso y materia' })
  async getCalificacionesPorCursoYMateria(
    @Param('idCurso') idCurso: number,
    @Param('idMateria') idMateria: number,
  ) {
    const calificaciones =
      await this.calificacionesService.getCalificacionesPorCursoYMateria(
        idCurso,
        idMateria,
      );
    return {
      message: 'Calificaciones por curso y materia',
      calificaciones,
    };
  }

  @Get('GestionActual/:idEstudiante')
  @Public()
  @ApiOperation({ summary: 'Calificaciones del año actual' })
  async getCalificacionesAño(@Param('idEstudiante') id: number) {
    const calificaciones =
      await this.calificacionesService.getCalificacionesPorEstudianteGestionActual(
        id,
      );

    return {
      message: `Calificaciones del año actual`,
      calificaciones,
    };
  }

  @Post('/CrearCalificacion')
  @ApiOperation({ summary: 'Crear calificacion' })
  async createCalificacion(
    @Body() createCalificacionDto: CreateCalificacionDto,
  ) {
    const calificacion = await this.calificacionesService.createCalificacion(
      createCalificacionDto,
    );
    return {
      message: 'Calificacion creada correctamente',
      calificacion,
    };
  }

  @Patch('/ActualizarCalificacion/:id')
  @ApiOperation({ summary: 'Actualizar una calificación existente (parcial)' })
  async updateCalificacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCalificacionDto,
  ) {
    const updated = await this.calificacionesService.updateCalificacion(
      id,
      dto,
    );
    return {
      message: 'Calificación actualizada correctamente',
      calificacion: updated,
    };
  }

  @Delete('EliminarCalificacion/:id')
  @ApiOperation({ summary: 'Eliminar calificacion' })
  async deleteCalificacion(@Param('id') id: number) {
    const calificacion =
      await this.calificacionesService.deleteCalificacion(id);
    return {
      message: 'Calificacion eliminada correctamente',
      calificacion,
    };
  }
}
