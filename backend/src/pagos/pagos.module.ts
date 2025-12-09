import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pagos } from './pagos.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { EstudianteModule } from 'src/estudiante/estudiante.module'; 
import { PersonalModule } from 'src/personal/personal.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Pagos]), EstudianteModule, PersonalModule],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
