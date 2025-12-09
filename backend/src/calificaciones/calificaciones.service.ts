import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificaciones } from './calificaciones.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificaciones)
    private readonly calificacionesRepository: Repository<Calificaciones>,

    @InjectRepository(AsignacionClase)
    private readonly asignacionClaseRepository: Repository<AsignacionClase>,
  ) {}

  async getCalificaciones(): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      relations: ['asignacionClase'],
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

    // Crear calificación
    const calificacion = this.calificacionesRepository.create({
      calificacion: dto.calificacion,
      aprobacion: dto.aprobacion,
      asignacionClase: asignacion,
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

    calificacion.calificacion = dto.calificacion;
    calificacion.aprobacion = dto.aprobacion;

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
