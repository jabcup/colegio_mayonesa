import { Module } from '@nestjs/common';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';
import { Padres } from 'src/padres/padres.entity';
import { Curso } from 'src/cursos/cursos.entity';
import { Pagos } from 'src/pagos/pagos.entity';
import { EstudianteTutor } from 'src/padre-estudiante/padreEstudiante.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estudiante,
      Padres,
      Curso,
      Pagos,
      EstudianteTutor,
      EstudianteCurso,
    ]),
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
