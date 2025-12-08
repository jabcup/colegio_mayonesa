import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horarios } from './horarios.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horarios)
    private repo: Repository<Horarios>,
  ){}

  async crearHorario(dto: CreateHorarioDto): Promise<Horarios>{
    return this.repo.save(this.repo.create(dto));
  }

  async listarHorarios(): Promise<Horarios[]>{
    return this.repo.find();
  }
}
