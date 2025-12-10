import { Module } from '@nestjs/common';
import { PadreEstudianteController } from './padre-estudiante.controller';
import { PadreEstudianteService } from './padre-estudiante.service';
import { EstudianteTutor } from './padreEstudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteTutor])],
  controllers: [PadreEstudianteController],
  providers: [PadreEstudianteService],
  exports: [PadreEstudianteService],
})
export class PadreEstudianteModule {}
