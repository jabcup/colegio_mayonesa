import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Padres } from './padres.entity';
import { CreatePadreDto } from './dto/create-padre.dto';

@Injectable()
export class PadresService {
  constructor(
    @InjectRepository(Padres)
    private repo: Repository<Padres>,
  ) {}

  async crear(dto: CreatePadreDto): Promise<Padres> {
    return this.repo.save(this.repo.create(dto)); // inserta
  }

  async todos(): Promise<Padres[]> {
    return this.repo.find(); // select * from padres
  }
}
