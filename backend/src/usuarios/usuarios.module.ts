import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// Auditoria
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios]),
    // Auditoria
    JwtModule.register({
      secret: 'SECRETO_SUPER_SEGURO',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
