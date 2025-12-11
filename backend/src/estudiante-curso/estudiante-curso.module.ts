import { Module } from '@nestjs/common';
import { EstudianteCursoController } from './estudiante-curso.controller';
import { EstudianteCursoService } from './estudiante-curso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteCurso } from './estudiante_curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteCurso])],
  controllers: [EstudianteCursoController],
  providers: [EstudianteCursoService],
  exports: [EstudianteCursoService],
})
export class EstudianteCursoModule {}
