import { Module } from '@nestjs/common';
import { AsistenciasController } from './asistencias.controller';
import { AsistenciasService } from './asistencias.service';
import { Asistencias } from './asistencias.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { AsignacionClase } from 'src/asignacion-clases/asignacionCursos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencias, AsignacionClase, Estudiante]),
  ],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
  exports: [AsistenciasService],
})
export class AsistenciasModule {}
