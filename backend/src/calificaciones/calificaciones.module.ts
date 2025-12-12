import { Module } from '@nestjs/common';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificaciones } from './calificaciones.entity';
// import { AsignacionClase } from 'src/asignacion-clases/asignacionCursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificaciones, Materias, Estudiante])],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService],
})
export class CalificacionesModule {}
