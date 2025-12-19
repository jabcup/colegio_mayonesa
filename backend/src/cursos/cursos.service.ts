import { BadRequestException, Injectable } from '@nestjs/common';
import { Curso } from './cursos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { Paralelos } from 'src/paralelos/paralelo.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  // cursos.service.ts

  async createCurso(dtoCurso: CreateCursoDto): Promise<Curso> {
    const cursoExistente = await this.cursoRepository.findOne({
      where: {
        nombre: dtoCurso.nombre,
        gestion: dtoCurso.gestion,
        paralelo: { id: dtoCurso.idParalelo },
      },
      relations: ['paralelo'], // Necesario para el filtro en la relación
    });

    if (cursoExistente) {
      throw new BadRequestException(
        'Ya existe un curso con este nombre, gestión y paralelo',
      );
    }

    const curso = this.cursoRepository.create({
      nombre: dtoCurso.nombre,
      gestion: dtoCurso.gestion,
      capacidad: dtoCurso.capacidad,
      paralelo: { id: dtoCurso.idParalelo }, // ← ¡Esto es lo que faltaba!
    });

    return await this.cursoRepository.save(curso);
  }

  async getCursos(): Promise<Curso[]> {
    return this.cursoRepository.find({
      relations: ['paralelo'],
    });
  }

  async getCursosActivos(): Promise<Curso[]> {
    const yearActual = new Date().getFullYear();
    return this.cursoRepository.find({
      where: {
        estado: 'activo',
        gestion: yearActual,
      },
      relations: ['paralelo'],
    });
  }

  async updateCurso(id: number, dtoCurso: CreateCursoDto): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({
      where: { id },
    });

    if (!curso) {
      throw new Error('Curso no encontrado');
    }
    curso.nombre = dtoCurso.nombre;
    curso.gestion = dtoCurso.gestion;
    curso.capacidad = dtoCurso.capacidad;

    curso.paralelo = { id: dtoCurso.idParalelo } as Paralelos;

    return await this.cursoRepository.save(curso);
  }

  async deleteCurso(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({ where: { id } });

    if (!curso) {
      throw new Error('Curso no encontrado');
    }

    curso.estado = 'inactivo';

    return this.cursoRepository.save(curso);
  }
}
