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

  async listarPadresEstudiantes() {
    return await this.estudianteTutorRepository.find({
      relations: ['tutor', 'estudiante'],
    });
  }

  async listarPadresEstudiantesActivos() {
    return await this.estudianteTutorRepository.find({
      where: { estado: 'activo' },
      relations: ['tutor', 'estudiante'],
    });
  }

  async listarTodosPadreEstudianteEspecifico(idEstudiante: number) {
    return await this.estudianteTutorRepository.find({
      where: { estudiante: { id: idEstudiante } },
      relations: ['tutor', 'estudiante'],
    });
  }
  async listarUltimoPadreEstudianteEspecifico(idEstudiante: number) {
    return await this.estudianteTutorRepository.find({
      where: {
        estado: 'activo',
        estudiante: { id: idEstudiante },
      },
      relations: ['tutor', 'estudiante'],
    });
  }
  // CRear DTO
  async asignarEstudiante(
    dtoPadreEstudiante: CreatePadreEstudianteDto,
  ): Promise<EstudianteTutor> {
    // 1. Validar si ya está asignado el mismo tutor
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

    // 2. Desactivar asignaciones activas anteriores (si existieran)
    await this.desactivarAsignacionesAnteriores(
      dtoPadreEstudiante.idEstudiante,
    );

    // 3. Crear nueva asignación
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
