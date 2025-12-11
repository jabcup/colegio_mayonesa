import { Body, Controller, Get,Delete, Post, Put, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateEstudianteFullDto } from './dto/update-estudiante-full.dto';
import { EstudianteCursoService } from './estudiante-curso.service';

@Controller('estudiante-curso')
export class EstudianteCursoController {
    constructor(private readonly estudianteCursoService: EstudianteCursoService) {}

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
        // Lógica para actualizar el estudiante en el curso
        return {
            message: 'Estudiante en curso actualizado exitosamente',
        };
    }

    @Delete('EliminarEstudianteCurso/:id')
    @ApiOperation({ summary: 'Eliminar Estudiante Curso' })
    removeEstudianteCurso(@Param('id') id: number) {
        // Lógica para eliminar el estudiante del curso
        return {
            message: 'Estudiante eliminado del curso exitosamente',
        };
    }
}
