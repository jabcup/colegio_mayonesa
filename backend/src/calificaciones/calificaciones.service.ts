import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificaciones } from './calificaciones.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificaciones)
    private readonly calificacionesRepository: Repository<Calificaciones>,

    @InjectRepository(AsignacionClase)
    private readonly asignacionClaseRepository: Repository<AsignacionClase>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async getCalificaciones(): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      relations: ['asignacionClase', 'estudiante'],
    });
  }

  async getCalificacionesPorAsignacion(
    idAsignacion: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        asignacionClase: { id: idAsignacion },
      },
      relations: ['asignacionClase', 'estudiante'],
    });
  }

  async getCalificacionesPorEstudiante(
    idEstudiante: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        estudiante: { id: idEstudiante },
      },
      relations: ['asignacionClase', 'estudiante'],
    });
  }

  async createCalificacion(
    dto: CreateCalificacionDto,
  ): Promise<Calificaciones> {
    const asignacion = await this.asignacionClaseRepository.findOne({
      where: { id: dto.idAsignacion },
    });

    if (!asignacion) {
      throw new Error('Asignacion no encontrada');
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: dto.idEstudiante },
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const aprobacion = dto.calificacion >= 51 ? true : false;

    // Crear calificación
    const calificacion = this.calificacionesRepository.create({
      calificacion: dto.calificacion,
      aprobacion: aprobacion,
      asignacionClase: asignacion,
      estudiante: estudiante,
    });

    return this.calificacionesRepository.save(calificacion);
  }

  async updateCalificacion(id: number, dto: CreateCalificacionDto) {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
    });

    if (!calificacion) {
      throw new Error('Calificacion no encontrada');
    }

    const new_aprobacion = dto.calificacion >= 51 ? true : false;

    calificacion.calificacion = dto.calificacion;
    calificacion.aprobacion = new_aprobacion;

    return this.calificacionesRepository.save(calificacion);
  }

  async deleteCalificacion(id: number): Promise<Calificaciones> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
    });

    if (!calificacion) {
      throw new Error('Calificacion no encontrada');
    }

    calificacion.estado = 'inactivo';
    return this.calificacionesRepository.save(calificacion);
  }
}
