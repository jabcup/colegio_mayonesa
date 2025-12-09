import { Module } from '@nestjs/common';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';
import { Notificaciones } from './notificaciones.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Personal } from 'src/personal/personal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Notificaciones, Estudiante, Personal])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService]
})
export class NotificacionesModule {}
