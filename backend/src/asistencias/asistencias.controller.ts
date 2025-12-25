import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Get()
  findAll() {
    return this.asistenciasService.findAll();
  }

  @Post()
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciasService.createAsistencia(createAsistenciaDto);
  }

  @Post('batch')
  createBatch(@Body() dtos: CreateAsistenciaDto[]) {
    return this.asistenciasService.createBatchAsistencias(dtos);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asistenciasService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    return this.asistenciasService.updateAsistencia(+id, updateAsistenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asistenciasService.remove(+id);
  }

  @Public()
  @Get('BuscarAsistenciasPorCursoYMateria/:idCurso/:idMateria')
  buscarAsistenciasPorCursoYMateria(
    @Param('idCurso') idCurso: string,
    @Param('idMateria') idMateria: string,
    @Query('estudianteId') estudianteId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.asistenciasService.buscarAsistenciasPorCursoYMateria(
      +idCurso,
      +idMateria,
      estudianteId ? +estudianteId : undefined,
      fromDate,
      toDate,
    );
  }

  @Get('asistenciaSemanal/:idEstudiante/:fecha')
  @Public()
  @ApiOperation({
    summary: 'Obtener asistencia semanal de un estudiante',
  })
  async obtenerAsistenciaSemanal(
    @Param('idEstudiante') idEstudiante: number,
    @Param('fecha') fecha: Date,
  ) {
    return this.asistenciasService.obtenerAsistenciasSemanaLaboral(
      idEstudiante,
      fecha,
    );
  }

  @Get('obtener/:idEstudiante/:fechaReferencia')
  @ApiOperation({
    summary: 'Obtener asistencias semanales de un estudiante',
  })
  async obtener(
    @Param('idEstudiante') idEstudiante: number,
    @Param('fechaReferencia') fechaReferencia: string,
  ) {
    return this.asistenciasService.obtener(
      Number(idEstudiante),
      new Date(fechaReferencia),
    );
  }
}
