import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { HorariosModule } from './horarios/horarios.module';
import { PersonalModule } from './personal/personal.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { PadresModule } from './padres/padres.module';
import { PadreEstudianteModule } from './padre-estudiante/padre-estudiante.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { PagosModule } from './pagos/pagos.module';
import { MateriasModule } from './materias/materias.module';
import { TutoresModule } from './tutores/tutores.module';
import { CursosModule } from './cursos/cursos.module';
import { AsignacionClasesModule } from './asignacion-clases/asignacion-clases.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { EstudianteCursoModule } from './estudiante-curso/estudiante-curso.module';

@Module({
  imports: [
    RolesModule,
    HorariosModule,
    PersonalModule,
    UsuariosModule,
    EstudianteModule,
    PadresModule,
    PadreEstudianteModule,
    NotificacionesModule,
    PagosModule,
    AsistenciasModule,
    CalificacionesModule,
    MateriasModule,
    TutoresModule,
    CursosModule,
    AsignacionClasesModule,
    EstudianteCursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
