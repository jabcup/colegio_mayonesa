import { Module } from '@nestjs/common';
import { AsignacionClasesController } from './asignacion-clases.controller';
import { AsignacionClasesService } from './asignacion-clases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Horarios } from 'src/horarios/horarios.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    AsignacionClase,
    Personal,
    Curso,
    Materias,
    Horarios,
  ]),
],
  controllers: [AsignacionClasesController],
  providers: [AsignacionClasesService],
  exports: [AsignacionClasesService],
})
export class AsignacionClasesModule {}
