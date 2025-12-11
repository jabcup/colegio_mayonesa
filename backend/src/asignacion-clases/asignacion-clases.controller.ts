import { Body, Controller, Delete, Post, Put, Param } from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { UpdateAsignacionFulDto } from './dto/update-asignacion-full.dto';

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

  @Put('ActualizarAsignacion/:id')
  @ApiOperation({ summary: 'Actualizar Asignacion' })
  async updateAsignacion(
    @Param('id') id: number,
    @Body() updateAsignacionDto: UpdateAsignacionFulDto,
  ) {
    const asignacion = await this.asignacionService.updateAsignacion(
      id,
      updateAsignacionDto,
    );
    return {
      message: 'Asignacion actualizada exitosamente',
      asignacion,
    };
  }

  @Delete('EliminarAsignacion/:id')
  @ApiOperation({ summary: 'Eliminar Asignacion' })
  removeAsignacion(@Param('id') id: number) {
    return this.asignacionService.deleteAsignacion(id);
  }

}
