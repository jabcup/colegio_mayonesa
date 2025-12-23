import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteTutor } from './padreEstudiante.entity';
import { Repository } from 'typeorm';
import { CreatePadreEstudianteDto } from './dto/create-padre-estudiante.dto';

@Injectable()
export class PadreEstudianteService {
  constructor(
    @InjectRepository(EstudianteTutor)
    private estudianteTutorRepository: Repository<EstudianteTutor>,
  ) {}

  async listarEstudiantesConTodosLosTutores() {
    const relaciones = await this.estudianteTutorRepository.find({
      relations: ['tutor', 'estudiante'],
      where: { estado: 'activo' },
      order: {
        estudiante: { id: 'ASC' },
        fecha_creacion: 'DESC',
      },
    });

    const estudiantesMap = new Map<number, any>();

    for (const relacion of relaciones) {
      const estudianteId = relacion.estudiante.id;

      if (!estudiantesMap.has(estudianteId)) {
        estudiantesMap.set(estudianteId, {
          estudiante: relacion.estudiante,
          tutores: [],
          relaciones: [],
        });
      }

      estudiantesMap.get(estudianteId).tutores.push({
        ...relacion.tutor,
        relacion: relacion.relacion,
        fechaAsignacion: relacion.fecha_creacion,
      });
    }

    return Array.from(estudiantesMap.values());
  }

  async listarEstudiantePadresActivos() {
    return await this.estudianteTutorRepository.find({
      where: { estado: 'activo' },
      relations: ['tutor', 'estudiante'],
    });
  }
  async listarTodosEstudiantePadresEspecifico(idEstudiante: number) {
    return await this.estudianteTutorRepository.find({
      where: { estudiante: { id: idEstudiante } },
      relations: ['tutor', 'estudiante'],
    });
  }

  async listarUltimoEstudiantePadreEspecifico(idEstudiante: number) {
    return await this.estudianteTutorRepository.find({
      where: {
        estado: 'activo',
        estudiante: { id: idEstudiante },
      },
      relations: ['tutor', 'estudiante'],
    });
  }
  async listarPadreEstudiantes(idPadre: number) {
    return await this.estudianteTutorRepository.find({
      where: { tutor: { id: idPadre }, estado: 'activo' },
      relations: ['tutor', 'estudiante'],
    });
  }
  async asignarEstudiante(
    dtoPadreEstudiante: CreatePadreEstudianteDto,
  ): Promise<EstudianteTutor> {
    const existente = await this.estudianteTutorRepository.findOne({
      where: {
        estudiante: { id: dtoPadreEstudiante.idEstudiante },
        tutor: { id: dtoPadreEstudiante.idTutor },
        estado: 'activo',
      },
    });

    if (existente) {
      throw new ConflictException('Este tutor ya está asignado al estudiante');
    }

    await this.desactivarAsignacionesAnteriores(
      dtoPadreEstudiante.idEstudiante,
    );

    return this.estudianteTutorRepository.save(
      this.estudianteTutorRepository.create({
        relacion: dtoPadreEstudiante.relacion,
        estudiante: { id: dtoPadreEstudiante.idEstudiante },
        tutor: { id: dtoPadreEstudiante.idTutor },
      }),
    );
  }

  async desactivarAsignacionesAnteriores(idEstudiante: number): Promise<void> {
    await this.estudianteTutorRepository.update(
      {
        estudiante: { id: idEstudiante },
        estado: 'activo',
      },
      {
        estado: 'inactivo',
      },
    );
  }
}
