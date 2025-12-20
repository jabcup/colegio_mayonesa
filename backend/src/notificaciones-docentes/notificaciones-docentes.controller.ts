// src/notificaciones-docentes/notificaciones-docentes.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { NotificacionesDocentesService } from './notificaciones-docentes.service';
import { CreateNotificacionesDocentesDto } from './dto/create-notificaciones-docente.dto';
import { UpdateNotificacionesDocentesDto } from './dto/update-notificaciones-docente.dto';
import { NotificacionesDocentes } from './notificaciones-docente.entity';

@ApiTags('notificaciones-docentes')
// ← Quitamos @UseGuards(JwtAuthGuard) y @ApiBearerAuth() para probar en Swagger fácilmente
@Controller('notificaciones-docentes')
export class NotificacionesDocentesController {
  constructor(
    private readonly notificacionesDocentesService: NotificacionesDocentesService,
  ) {}

  // Crear una notificación (útil para pruebas manuales o desde otros servicios)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación para un docente' })
  @ApiCreatedResponse({ description: 'Notificación creada', type: NotificacionesDocentes })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  async create(@Body() createDto: CreateNotificacionesDocentesDto) {
    return this.notificacionesDocentesService.create(createDto);
  }

  // Obtener todas las notificaciones (para admin o pruebas)
  @Get()
  @ApiOperation({ summary: 'Listar todas las notificaciones activas' })
  @ApiOkResponse({ description: 'Lista de notificaciones', type: [NotificacionesDocentes] })
  async findAll() {
    return this.notificacionesDocentesService.findAll();
  }

  // Obtener notificaciones de un docente específico (simulando "mis notificaciones")
  @Get('docente/:docenteId')
  @ApiOperation({ summary: 'Obtener notificaciones de un docente específico' })
  @ApiOkResponse({ description: 'Notificaciones del docente', type: [NotificacionesDocentes] })
  @ApiNotFoundResponse({ description: 'Docente sin notificaciones o inválido' })
  async getByDocente(@Param('docenteId') docenteId: number) {
    return this.notificacionesDocentesService.findByDocente(docenteId);
  }

  // Contar notificaciones no leídas de un docente
  @Get('no-leidas/:docenteId')
  @ApiOperation({ summary: 'Contar notificaciones no leídas de un docente' })
  @ApiOkResponse({ description: 'Cantidad de notificaciones pendientes', example: { count: 5 } })
  async countNoLeidas(@Param('docenteId') docenteId: number) {
    return this.notificacionesDocentesService.countNoLeidas(docenteId);
  }

  // Obtener una notificación por ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiOkResponse({ description: 'Notificación encontrada', type: NotificacionesDocentes })
  @ApiNotFoundResponse({ description: 'Notificación no encontrada o inactiva' })
  async findOne(@Param('id') id: number) {
    return this.notificacionesDocentesService.findOne(+id);
  }

  // Marcar como leída (endpoint específico, más limpio que update general)
  @Patch(':id/leida')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiOkResponse({ description: 'Notificación marcada como leída', type: NotificacionesDocentes })
  async markAsRead(@Param('id') id: number) {
    return this.notificacionesDocentesService.markAsRead(+id);
  }

  // Actualizar notificación (por si necesitas cambiar mensaje, tipo, etc.)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificación' })
  @ApiOkResponse({ description: 'Notificación actualizada', type: NotificacionesDocentes })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateNotificacionesDocentesDto,
  ) {
    return this.notificacionesDocentesService.update(+id, updateDto);
  }

  // Eliminar (soft delete - cambia estado a inactivo)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (desactivar) una notificación' })
  @ApiOkResponse({ description: 'Notificación desactivada', type: NotificacionesDocentes })
  @ApiNotFoundResponse({ description: 'Notificación no encontrada' })
  async remove(@Param('id') id: number) {
    return this.notificacionesDocentesService.remove(+id);
  }

  // Endpoint auxiliar para crear notificación de asignación (útil para pruebas)
  @Post('asignacion')
  @ApiOperation({ summary: 'Crear notificación automática por asignación de curso (para pruebas)' })
  @ApiCreatedResponse({ description: 'Notificación de asignación creada' })
  async crearNotificacionAsignacion(
    @Body() body: { docenteId: number; mensaje: string; asignacionId?: number },
  ) {
    return this.notificacionesDocentesService.crearNotificacionAsignacion(
      body.docenteId,
      body.mensaje,
      body.asignacionId,
    );
  }
}