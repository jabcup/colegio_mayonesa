import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asistenciasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAsistenciaDto: UpdateAsistenciaDto) {
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
    return this.asistenciasService.buscarAsistenciasPorCursoYMateria(+idCurso, +idMateria);
  }
}