import { Injectable, NotFoundException } from '@nestjs/common';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Curso } from '../cursos/cursos.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';

@Injectable()
export class EstudianteCursoService {
  constructor(
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    private dataSource: DataSource,
  ) {}

  async getEstudiantesPorCurso(idCurso: number) {
    return this.estudianteCursoRepository.find({
      where: { curso: { id: idCurso }, estado: 'activo' },
      relations: ['estudiante'], // Para traer datos del estudiante
    });
  }

  async FindOneEst(id: number): Promise<EstudianteCurso> {
    const estudianteCurso = await this.estudianteCursoRepository.findOne({
      where: { id },
      relations: ['estudiante', 'curso'],
    });
    if (!estudianteCurso) {
      throw new NotFoundException('Asignación no encontrada');
    }
    return estudianteCurso;
  }

  async FindOneCurso(id: number): Promise<EstudianteCurso> {
    const estudianteCurso = await this.estudianteCursoRepository.findOne({
      where: { id },
      relations: ['curso', 'estudiante'],
    });
    if (!estudianteCurso) {
      throw new NotFoundException('Asignación no encontrada');
    }
    return estudianteCurso;
  }

  async updateEstudianteCursos(
    estudianteCursoId: number,
    nuevoCursoId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const asignacion = await manager.findOne(EstudianteCurso, {
        where: { id: estudianteCursoId },
        relations: ['estudiante', 'curso'],
      });

      if (!asignacion) {
        throw new NotFoundException('Asignación no encontrada');
      }

      const nuevoCurso = await manager.findOne(Curso, {
        where: { id: nuevoCursoId },
      });

      if (!nuevoCurso) {
        throw new NotFoundException(
          `Curso con ID ${nuevoCursoId} no encontrado`,
        );
      }

      // Actualizamos el curso en la relación
      asignacion.curso = nuevoCurso;

      return await manager.save(asignacion);
    });
  }

  async deleteEstudianteCurso(id: number): Promise<EstudianteCurso> {
    const estudianteCurso = await this.estudianteCursoRepository.findOne({
      where: { id },
    });
    if (!estudianteCurso) {
      throw new NotFoundException('Asignación no encontrada');
    }
    estudianteCurso.estado = 'inactivo';
    return await this.estudianteCursoRepository.save(estudianteCurso);
  }
}
