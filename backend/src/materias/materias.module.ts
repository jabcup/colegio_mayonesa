import { Module } from '@nestjs/common';
import { MateriasController } from './materias.controller';
import { MateriasService } from './materias.service';
import { Materias } from './materias.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Materias])],
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriasModule {}
