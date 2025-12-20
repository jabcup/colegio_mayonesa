import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
// <<<<<<< HEAD
import { PagosComprobanteService } from './pagos-comprobante.service';
// =======
// >>>>>>> charu
import { Pagos } from './pagos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from 'src/estudiante/estudiante.module';
import { PersonalModule } from 'src/personal/personal.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagos]),
    EstudianteModule,
    PersonalModule,
    UsuariosModule,
  ],
  controllers: [PagosController],
// <<<<<<< HEAD
  providers: [PagosService, PagosComprobanteService],
// =======
  // providers: [PagosService],
// >>>>>>> charu
})
export class PagosModule {}
