import {
  Body,
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateEstudianteFullDto } from './dto/update-estudiante-full.dto';
import { EstudianteCursoService } from './estudiante-curso.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('estudiante-curso')
export class EstudianteCursoController {
  constructor(
    private readonly estudianteCursoService: EstudianteCursoService,
  ) {}

  @Get('/estudiantes-por-curso/:idCurso')
  async estudiantesPorCurso(@Param('idCurso') idCurso: string) {
    return this.estudianteCursoService.getEstudiantesPorCurso(Number(idCurso));
  }

  @Get('/cursoEstudiante/:idEstudiante')
  @Public()
  async cursoEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.estudianteCursoService.getCursoEstudiante(idEstudiante);
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

  @Get('no-calificados')
  async getEstudiantesNoCalificados(
    @Query('idCurso') idCurso: string,
    @Query('idMateria') idMateria: string,
  ) {
    const curso = Number(idCurso);
    const materia = Number(idMateria);

    if (isNaN(curso) || isNaN(materia)) {
      throw new BadRequestException('idCurso o idMateria inválidos');
    }

    return await this.estudianteCursoService.obtenerEstudiantesNoCalificados(
      curso,
      materia,
    );
  }
}
