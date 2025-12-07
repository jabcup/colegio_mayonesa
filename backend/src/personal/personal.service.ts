import { Injectable } from '@nestjs/common';
import { Personal } from './personal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonalDto } from './dto/create-personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
  ) {}

  async createPersonal(dtoPersonal: CreatePersonalDto): Promise<Personal> {
    const personal = this.personalRepository.create(dtoPersonal);
    return this.personalRepository.save(personal);
  }

  async getPersonal(): Promise<Personal[]> {
    return this.personalRepository.find();
  }

  async getPersonalActivo(): Promise<Personal[]> {
    return this.personalRepository.find({ where: { estado: 'activo' } });
  }

  async updatePersonal(
    id: number,
    dtoPersonal: CreatePersonalDto,
  ): Promise<Personal> {
    const personal = await this.personalRepository.findOne({ where: { id } });

    if (!personal) {
      throw new Error('Personal no encontrado');
    }

    // Mezcla los datos nuevos con los actuales
    Object.assign(personal, dtoPersonal);

    return this.personalRepository.save(personal);
  }

  async deletePersonal(id: number): Promise<Personal> {
    const personal = await this.personalRepository.findOne({ where: { id } });
    if (!personal) {
      throw new Error('Personal no encontrado');
    }
    personal.estado = 'inactivo';
    return this.personalRepository.save(personal);
  }
}
