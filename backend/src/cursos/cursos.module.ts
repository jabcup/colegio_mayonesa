import { Module } from '@nestjs/common';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './cursos.entity';
import { Paralelos } from 'src/paralelos/paralelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Paralelos])],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
