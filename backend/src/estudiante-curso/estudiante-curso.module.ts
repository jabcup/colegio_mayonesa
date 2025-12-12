import { Module } from '@nestjs/common';
import { EstudianteCursoController } from './estudiante-curso.controller';
import { EstudianteCursoService } from './estudiante-curso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Curso } from 'src/cursos/cursos.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Curso, EstudianteCurso])],
  controllers: [EstudianteCursoController],
  providers: [EstudianteCursoService],
  exports: [EstudianteCursoService],
})
export class EstudianteCursoModule {}
