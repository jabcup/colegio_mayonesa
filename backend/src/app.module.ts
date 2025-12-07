import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { HorariosModule } from './horarios/horarios.module';
import { PersonalModule } from './personal/personal.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MateriasModule } from './materias/materias.module';
import { TutoresModule } from './tutores/tutores.module';
import { CursosModule } from './cursos/cursos.module';
import { AsignacionClasesModule } from './asignacion-clases/asignacion-clases.module';

@Module({
  imports: [RolesModule, HorariosModule, PersonalModule, UsuariosModule, MateriasModule, TutoresModule, CursosModule, AsignacionClasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
