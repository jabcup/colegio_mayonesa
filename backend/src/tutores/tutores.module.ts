import { Module } from '@nestjs/common';
import { TutoresController } from './tutores.controller';
import { TutoresService } from './tutores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutores } from './tutores.entity';
import { Personal } from '../personal/personal.entity';
import { Curso } from '../cursos/cursos.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutores, Personal, Curso, Usuarios])],
  controllers: [TutoresController],
  providers: [TutoresService],
  exports: [TutoresService],
})
export class TutoresModule {}
