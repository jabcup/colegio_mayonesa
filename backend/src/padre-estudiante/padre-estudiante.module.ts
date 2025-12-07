import { Module } from '@nestjs/common';
import { PadreEstudianteController } from './padre-estudiante.controller';
import { PadreEstudianteService } from './padre-estudiante.service';

@Module({
  controllers: [PadreEstudianteController],
  providers: [PadreEstudianteService]
})
export class PadreEstudianteModule {}
