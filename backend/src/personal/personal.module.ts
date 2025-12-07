import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personal } from './personal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personal])],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService],
})
export class PersonalModule {}
