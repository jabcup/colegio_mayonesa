import { Module } from '@nestjs/common';
import { AsignacionClasesController } from './asignacion-clases.controller';
import { AsignacionClasesService } from './asignacion-clases.service';

@Module({
  controllers: [AsignacionClasesController],
  providers: [AsignacionClasesService]
})
export class AsignacionClasesModule {}
