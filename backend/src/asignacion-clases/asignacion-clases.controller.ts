import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';

@Controller('asignacion-clases')
export class AsignacionClasesController {
  constructor(private readonly asignacionService: AsignacionClasesService) {}
  @Post('CrearAsignacion')
  @ApiOperation({ summary: 'Crear Asignacion' })
  // async createAsignacion(
  //   @Body() CreateAsignacionFullDto: CreateAsignacionFulDto,
  // ) {
  //   const asignacion = await this.asignacionService.createAsignacionFull(
  //     CreateAsignacionFullDto,
  //   );
  //   return {
  //     message: 'Asignacion creada exitosamente',
  //     asignacion,
  //   };
  // }
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
  @Get('estudiante/:id')
  @ApiOperation({
    summary: 'Obtener asignaciones de clase por ID de estudiante',
  })
  getPorEstudiante(@Param('id') id: number) {
    return this.asignacionService.getAsignacionesPorEstudiante(id);
  }
}
