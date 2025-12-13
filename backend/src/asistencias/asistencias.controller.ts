import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Param,
} from '@nestjs/common';

import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciasController {
  constructor(
    private readonly asistenciasService: AsistenciasService,
    private readonly asistenciaService: AsistenciasService,
  ) {}

  @Get('VerAsistencias')
  @ApiOperation({ summary: 'Ver Asistencias' })
  getAsistencias() {
    return this.asistenciaService.getAsistencias();
  }

  @Post('CrearAsistencia')
  @ApiOperation({ summary: 'Crear Asistencia' })
  async createAsistencia(@Body() CreateAsistenciaDto: CreateAsistenciaDto) {
    const asistencia =
      await this.asistenciaService.createAsistencia(CreateAsistenciaDto);
    return {
      message: 'Asistencia creada exitosamente',
      asistencia,
    };
  }

  @Put('ActualizarAsistencia/:id')
  @ApiOperation({ summary: 'Actualizar Asistencia' })
  async updateAsistencia(
    @Param('id') id: number,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    const asistencia = await this.asistenciaService.updateAsistencia(
      id,
      updateAsistenciaDto,
    );
    return {
      message: 'Asistencia actualizada exitosamente',
      asistencia,
    };
  }

  @Delete('EliminarAsistencia/:id')
  @ApiOperation({ summary: 'Eliminar Asistencia' })
  removeAsistencia(@Param('id') id: number) {
    return this.asistenciaService.remove(id);
  }

  @Get()
  findAll() {
    return this.asistenciasService.findAll();
  }

  @Post()
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciasService.createAsistencia(createAsistenciaDto);
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

  @Get('BuscarAsistenciasPorCursoYMateria/:idCurso/:idMateria')
  buscarAsistenciasPorCursoYMateria(
    @Param('idCurso') idCurso: string,
    @Param('idMateria') idMateria: string,
  ) {
    return this.asistenciasService.buscarAsistenciasPorCursoYMateria(
      +idCurso,
      +idMateria,
    );
  }
}
