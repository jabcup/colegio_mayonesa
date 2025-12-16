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

  async listarEstudiantesPadres() {
    return await this.estudianteTutorRepository.find({
      relations: ['tutor', 'estudiante'],
    });
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
