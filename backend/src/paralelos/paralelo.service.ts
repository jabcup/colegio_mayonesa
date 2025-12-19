import { Injectable, NotFoundException } from '@nestjs/common';
import { Paralelos } from './paralelo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParaleloDto } from './dto/create-paralelo.dto';
// import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class ParalelosService {
  constructor(
    @InjectRepository(Paralelos)
    private readonly paraleloRepository: Repository<Paralelos>,
  ) {}

  async createParalelo(dtoParalelo: CreateParaleloDto): Promise<Paralelos> {
    const paralelo = this.paraleloRepository.create(dtoParalelo);
    return this.paraleloRepository.save(paralelo);
  }

  async getParalelos(): Promise<Paralelos[]> {
    return this.paraleloRepository.find();
  }
  async findOne(id: number): Promise<Paralelos> {
    const paralelo = await this.paraleloRepository.findOneBy({ id });
    if (!paralelo) throw new NotFoundException('Paralelo no encontrado');
    return paralelo;
  }
  async update(id: number, dto: CreateParaleloDto): Promise<Paralelos> {
    await this.findOne(id);
    await this.paraleloRepository.update(id, dto);
    return this.findOne(id);
  }

  async deleteParalelo(id: number): Promise<Paralelos> {
    const paralelo = await this.paraleloRepository.findOne({ where: { id } });
    if (!paralelo) {
      throw new Error('Paralelo no encontrado');
    }
    paralelo.estado = 'inactivo';
    return this.paraleloRepository.save(paralelo);
  }
}
