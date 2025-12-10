import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personal } from './personal.entity';
import { Roles } from 'src/roles/roles.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personal, Roles, Usuarios])],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService, TypeOrmModule],
})
export class PersonalModule {}
