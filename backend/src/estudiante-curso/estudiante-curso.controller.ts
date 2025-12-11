import { Controller, Get, Param } from '@nestjs/common';
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
}
