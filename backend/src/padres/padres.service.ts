import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Padres } from './padres.entity';
import { CreatePadreDto } from './dto/create-padre.dto';

@Injectable()
export class PadresService {
  constructor(
    @InjectRepository(Padres)
    private padreRepository: Repository<Padres>,
  ) {}

  async crear(dto: CreatePadreDto): Promise<Padres> {
    return this.padreRepository.save(this.padreRepository.create(dto)); // inserta
  }

  async todos(): Promise<Padres[]> {
    return this.padreRepository.find(); // select * from padres
  }

  async updatePadre(id: number, dtoPadre: CreatePadreDto): Promise<Padres> {
    const padre = await this.padreRepository.findOne({ where: { id } });

    if (!padre) {
      throw new Error('Curso no encontrado');
    }

    // Mezcla los datos nuevos con los actuales
    Object.assign(padre, dtoPadre);

    return this.padreRepository.save(padre);
  }

  async deletePadre(id: number): Promise<Padres> {
    const padre = await this.padreRepository.findOne({ where: { id } });

    if (!padre) {
      throw new Error('Curso no encontrado');
    }

    padre.estado = 'inactivo';

    return this.padreRepository.save(padre);
  }
}
