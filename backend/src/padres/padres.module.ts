import { Module } from '@nestjs/common';
import { PadresController } from './padres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Padres} from './padres.entity';
import { PadresService } from './padres.service';

@Module({
  imports: [TypeOrmModule.forFeature([Padres])],
  controllers: [PadresController],
  providers: [PadresService]
})
export class PadresModule {}
