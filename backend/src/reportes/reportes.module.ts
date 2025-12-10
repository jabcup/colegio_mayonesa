import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { VistaPagosEstudiantesView } from './vista-pagos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VistaPagosEstudiantesView]), // 👈 entidad que representa tu VIEW
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
