import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { VistaPagosEstudiantesView } from './entity/vista-pagos.entity';
import { VistaPagosPorEstudiante } from './entity/vista-pagos-estudiante.entity';
import { VistaCalificacionesCurso } from './entity/vista-calificaciones-curso.entity';
import { VistaCalificacionesEstudiante } from './entity/vista-calificaciones-estudiante.entity';
import { VistaAsistenciasEstudiante } from './entity/vista-asistencias-estudiante.entity';
import { VistaAsistenciasCurso } from './entity/vista-asistencias-curso.entity';
import { VistaTutoresCurso } from './entity/vista-tutores-curso.entity';
import { VistaEstudiantesCurso } from './entity/vista-estuidantes-curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VistaPagosEstudiantesView,
      VistaPagosPorEstudiante,
      VistaCalificacionesCurso,
      VistaCalificacionesEstudiante,
      VistaAsistenciasEstudiante,
      VistaAsistenciasCurso,
      VistaTutoresCurso,
      VistaEstudiantesCurso,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
