import { Injectable } from '@nestjs/common';
import { Curso } from './cursos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}
  async createCurso(dtoCurso: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create(dtoCurso);
    return this.cursoRepository.save(curso);
  }

  async getCursos(): Promise<Curso[]> {
    return this.cursoRepository.find();
  }
}
