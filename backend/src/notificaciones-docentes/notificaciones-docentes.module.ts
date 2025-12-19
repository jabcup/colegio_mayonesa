import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesDocentesService } from './notificaciones-docentes.service';
import { NotificacionesDocentesController } from './notificaciones-docentes.controller';
import { NotificacionesDocentes } from './notificaciones-docente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificacionesDocentes]), // Registra la entity
  ],
  controllers: [NotificacionesDocentesController],
  providers: [NotificacionesDocentesService],
  exports: [NotificacionesDocentesService], // ¡IMPORTANTE! Para usarlo en otros módulos
})
export class NotificacionesDocentesModule {}