import { Body, Controller, Get, Delete, Put, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateEstudianteFullDto } from './dto/update-estudiante-full.dto';
import { EstudianteCursoService } from './estudiante-curso.service';

@Controller('estudiante-curso')
export class EstudianteCursoController {
  constructor(
    private readonly estudianteCursoService: EstudianteCursoService,
  ) {}

  @Get(':idCurso')
  async getEstudiantesPorCurso(@Param('idCurso') idCurso: number) {
    return this.estudianteCursoService.getEstudiantesPorCurso(Number(idCurso));
  }

  @Put('ActualizarEstudianteCurso/:id')
  @ApiOperation({ summary: 'Actualizar Estudiante Curso' })
  async updateEstudianteCurso(
    @Param('id') id: number,
    @Body() updateEstudianteDto: UpdateEstudianteFullDto,
  ) {
    await this.estudianteCursoService.updateEstudianteCursos(
      id,
      updateEstudianteDto.idCurso,
    );

    return {
      message: 'Estudiante en curso actualizado exitosamente',
    };
  }

  @Delete('EliminarEstudianteCurso/:id')
  @ApiOperation({ summary: 'Eliminar Estudiante Curso' })
  async removeEstudianteCurso(@Param('id') id: number) {
    await this.estudianteCursoService.deleteEstudianteCurso(id);

    return {
      message: 'Estudiante eliminado del curso exitosamente',
    };
  }
}
