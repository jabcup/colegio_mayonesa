import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materias } from './materias.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Injectable()
export class MateriasService {
  constructor(@InjectRepository(Materias) private repo: Repository<Materias>) {}

  async crearMateria(dto: CreateMateriaDto): Promise<Materias> {
    return this.repo.save(this.repo.create(dto));
  }

  async listarMaterias(): Promise<Materias[]> {
    return this.repo.find();
  }

  async updateMateria(
    id: number,
    dtoMateria: CreateMateriaDto,
  ): Promise<Materias> {
    const materia = await this.repo.findOne({ where: { id } });

    if (!materia) {
      throw new Error('Curso no encontrado');
    }

    // Mezcla los datos nuevos con los actuales
    Object.assign(materia, dtoMateria);

    return this.repo.save(materia);
  }

  async deleteMateria(id: number): Promise<Materias> {
    const materia = await this.repo.findOne({ where: { id } });

    if (!materia) {
      throw new Error('Curso no encontrado');
    }

    materia.estado = 'inactivo';

    return this.repo.save(materia);
  }
}
