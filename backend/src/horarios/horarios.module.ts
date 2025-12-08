import { Module } from '@nestjs/common';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { Horarios } from './horarios.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Horarios])],
  controllers: [HorariosController],
  providers: [HorariosService]
})
export class HorariosModule {}
