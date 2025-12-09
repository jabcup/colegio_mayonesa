import { Module } from '@nestjs/common';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])],
  exports: [TypeOrmModule],
  controllers: [EstudianteController],
  providers: [EstudianteService]
})
export class EstudianteModule {}
