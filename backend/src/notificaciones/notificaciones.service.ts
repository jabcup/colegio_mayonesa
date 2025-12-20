import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Notificaciones } from './notificaciones.entity';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { UpdateNotificacionesDto } from './dto/update-notificaciones.dto';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Personal } from 'src/personal/personal.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificaciones)
    private readonly notificacionesRepository: Repository<Notificaciones>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    private dataSource: DataSource,
  ) {}

  async crearNotificacion(dto: CreateNotificacionesDto) {
    return this.dataSource.transaction(async (manager) => {
      const estudiante = await manager.findOne(Estudiante, {
        where: { id: dto.idEstudiante },
      });

      if (!estudiante) {
        throw new Error('Estudiante no encontrado');
      }

      const personal = await manager.findOne(Personal, {
        where: { id: dto.idPersonal },
      });

      if (!personal) {
        throw new Error('Personal no encontrado');
      }

      const notificacion = manager.create(Notificaciones, {
        asunto: dto.asunto,
        mensaje: dto.mensaje,
        estado: 'activo',
        Estudiante: estudiante,
        Personal: personal,
      });

      const nuevaNotificacion = await manager.save(notificacion);

      return {
        message: 'Notificación creada exitosamente',
        notificacion: nuevaNotificacion,
      };
    });
  }

  async obtenerNotificacionesPorEstudiante(
    estudiante: Estudiante,
  ): Promise<Notificaciones[]> {
    return this.notificacionesRepository.find({
      where: { Estudiante: estudiante, estado: 'activo' },
      relations: ['Estudiante', 'Personal'],
    });
  }

  async findOne(id: number): Promise<Notificaciones> {
    const notificacion = await this.notificacionesRepository.findOne({
      where: { id },
      relations: ['Estudiante', 'Personal'],
    });
    if (!notificacion) throw new Error('Notificación no encontrada');
    return notificacion;
  }

  async actualizarNotificacion(
    id: number,
    dto: UpdateNotificacionesDto,
  ): Promise<Notificaciones> {
    return this.dataSource.transaction(async (manager) => {
      const notificacion = await this.findOne(id);

      if (dto.idEstudiante) {
        const estudiante = await manager.findOne(Estudiante, {
          where: { id: dto.idEstudiante },
        });
        if (!estudiante) throw new Error('Estudiante no encontrado');
        notificacion.Estudiante = estudiante;
      }

      if (dto.idPersonal) {
        const personal = await manager.findOne(Personal, {
          where: { id: dto.idPersonal },
        });
        if (!personal) throw new Error('Personal no encontrado');
        notificacion.Personal = personal;
      }

      Object.assign(notificacion, {
        asunto: dto.asunto || notificacion.asunto,
        mensaje: dto.mensaje || notificacion.mensaje,
      });

      await manager.save(notificacion);
      return this.findOne(id);
    });
  }

  async eliminarNotificacion(id: number): Promise<Notificaciones> {
    const notificacion = await this.notificacionesRepository.findOne({
      where: { id },
    });
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }
    notificacion.estado = 'inactivo';
    return this.notificacionesRepository.save(notificacion);
  }
}
