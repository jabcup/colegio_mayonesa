import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { UpdateAsignacionFulDto } from './dto/update-asignacion-full.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('horario/:idPersonal')
  async getHorarioDocente(
    @Param('idPersonal', ParseIntPipe) idPersonal: number,
  ) {
    return this.asignacionService.getHorarioDocente(idPersonal);
  }

  @Get('curso/:idCurso')
  @ApiOperation({ summary: 'Obtener horario de clases por curso' })
  getAsignacionesPorCurso(@Param('idCurso') idCurso: number) {
    return this.asignacionService.getAsignacionesPorCurso(Number(idCurso));
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
