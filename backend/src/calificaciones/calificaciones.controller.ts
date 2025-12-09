import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CalificacionesService } from './calificaciones.service';

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

  @Post()
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

  @Put('EditarCalificacion/:id')
  @ApiOperation({ summary: 'Editar calificacion' })
  async updateCalificacion(
    @Param('id') id: number,
    @Body() dto: CreateCalificacionDto,
  ) {
    const calificacion = await this.calificacionesService.updateCalificacion(
      id,
      dto,
    );
    return {
      message: 'Calificacion actualizada correctamente',
      calificacion,
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
