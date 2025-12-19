import { Module } from '@nestjs/common';
import { ParaleloController } from './paralelo.controller';
import { ParalelosService } from './paralelo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paralelos } from './paralelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paralelos])],
  controllers: [ParaleloController],
  providers: [ParalelosService],
  exports: [ParalelosService],
})
export class ParaleloModule {}
