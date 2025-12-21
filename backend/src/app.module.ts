import { Module } from '@nestjs/common';
// import { join } from 'path';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { ReportesModule } from './reportes/reportes.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { ParaleloModule } from './paralelos/paralelo.module';
// Auditoria
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditoriaInterceptor } from './auditoria/auditoria.interceptor';
import { AuthModule } from './auth/auth.module';

import { AvisosModule } from './avisos/avisos.module';

@Module({
  imports: [
    //Conexión con la base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: '',
      password: '',
      database: 'colegio',
      autoLoadEntities: true,
      synchronize: false,
    }),
    //Módulos
    RolesModule,
    HorariosModule,
    PersonalModule,
    UsuariosModule,
    EstudianteModule,
    PadresModule,
    PadreEstudianteModule,
    NotificacionesModule,
    PagosModule,
    MateriasModule,
    TutoresModule,
    CursosModule,
    AsignacionClasesModule,
    AsistenciasModule,
    CalificacionesModule,
    EstudianteCursoModule,
    ReportesModule,
    AuditoriaModule,
    //Auditoria
    AuthModule,

    AvisosModule,

    ParaleloModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditoriaInterceptor,
    },
  ],
})
export class AppModule {}

