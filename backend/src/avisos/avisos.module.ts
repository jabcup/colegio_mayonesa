import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisosController } from './avisos.controller';
import { AvisosService } from './avisos.service';
import { Avisos } from './avisos.entity';
import { Curso } from '../cursos/cursos.entity';
import { Personal } from '../personal/personal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avisos, Curso, Personal])],
  controllers: [AvisosController],
  providers: [AvisosService],
  exports: [AvisosService],
})
export class AvisosModule {}
