import { Module } from '@nestjs/common';
import { EstudianteCursoController } from './estudiante-curso.controller';
import { EstudianteCursoService } from './estudiante-curso.service';

@Module({
  controllers: [EstudianteCursoController],
  providers: [EstudianteCursoService]
})
export class EstudianteCursoModule {}
