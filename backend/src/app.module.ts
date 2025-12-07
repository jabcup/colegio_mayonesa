import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { HorariosModule } from './horarios/horarios.module';
import { PersonalModule } from './personal/personal.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [RolesModule, HorariosModule, PersonalModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
