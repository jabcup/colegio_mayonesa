import { Body, Controller, Get, Delete, Post, Put, Param } from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { UpdateAsignacionFulDto } from './dto/update-asignacion-full.dto';

@Controller('asignacion-clases')
export class AsignacionClasesController {
  constructor(private readonly asignacionService: AsignacionClasesService) {}

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