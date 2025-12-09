import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Padres } from './padres.entity';
import { CreatePadreDto } from './dto/create-padre.dto';
import { UpdatePadreDto } from './dto/update-padre.dto';

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

  async findOne(id: number): Promise<Padres> {
    const padre = await this.repo.findOneBy({ id });
    if (!padre) throw new Error('Padre no encontrado');
    return padre;
  }

  async actualizar(id: number, dto: Partial<UpdatePadreDto>): Promise<Padres> {
    await this.findOne(id); // Valida existencia
    await this.repo.update(id, dto);
    return this.findOne(id); // Devuelve padre actualizado
  }

  async eliminar(id: number): Promise<void> {
    const padre = await this.repo.findOne({ where: { id } });
    if (!padre) {
      throw new Error('Padre no encontrado');
    }
    padre.estado = 'inactivo';
    await this.repo.save(padre);
  }
}
