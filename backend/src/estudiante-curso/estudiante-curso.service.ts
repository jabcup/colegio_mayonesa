import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteCurso } from './estudiante_curso.entity';

@Injectable()
export class EstudianteCursoService {
  constructor(
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepo: Repository<EstudianteCurso>,
  ) {}

  async getEstudiantesPorCurso(idCurso: number) {
    return this.estudianteCursoRepo.find({
      where: { curso: { id: idCurso }, estado: 'activo' },
      relations: ['estudiante'], // Para traer datos del estudiante
    });
  }
}
