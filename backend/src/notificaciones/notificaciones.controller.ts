import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { NotificacionesService } from './notificaciones.service';
import { UpdateNotificacionesDto } from './dto/update-notificaciones.dto';
import { Estudiante } from '../estudiante/estudiante.entity';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('CrearNotificacion')
  @ApiOperation({ summary: 'Crea una nueva notificacion' })
  async createNotificacion(
    @Body() createNotificacionesDto: CreateNotificacionesDto,
  ) {
    const notificacion = await this.notificacionesService.crearNotificacion(
      createNotificacionesDto,
    );
    return {
      message: 'Notificacion enviada correctamente',
      notificacion,
    };
  }

  @Get('Estudiante/:estudianteId')
  @ApiOperation({ summary: 'Obtener Notificaciones por Estudiante' })
  async obtenerNotificacionesPorEstudiante(
    @Param('estudianteId') estudianteId: number,
  ) {
    const estudiante = new Estudiante();
    estudiante.id = estudianteId;
    return this.notificacionesService.obtenerNotificacionesPorEstudiante(
      estudiante,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Notificacion' })
  update(@Param('id') id: string, @Body() dto: UpdateNotificacionesDto) {
    return this.notificacionesService.actualizarNotificacion(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Notificacion' })
  eliminarNotificacion(@Param('id') id: string) {
    return this.notificacionesService.eliminarNotificacion(+id);
  }
}
