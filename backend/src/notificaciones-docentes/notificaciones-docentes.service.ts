// src/notificaciones-docentes/notificaciones-docentes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificacionesDocentes } from './notificaciones-docente.entity';
import { CreateNotificacionesDocentesDto } from './dto/create-notificaciones-docente.dto';
import { UpdateNotificacionesDocentesDto } from './dto/update-notificaciones-docente.dto';

@Injectable()
export class NotificacionesDocentesService {
  constructor(
    @InjectRepository(NotificacionesDocentes)
    private readonly notiRepo: Repository<NotificacionesDocentes>,
  ) {}

  async create(createDto: CreateNotificacionesDocentesDto): Promise<NotificacionesDocentes> {
    const notificacion = this.notiRepo.create({
      ...createDto,
      tipo: createDto.tipo ?? 'asignacion_curso',
      estado: createDto.estado ?? 'activo',
    });
    return await this.notiRepo.save(notificacion);
  }

  async findByDocente(docenteId: number): Promise<NotificacionesDocentes[]> {
    return await this.notiRepo.find({
      where: { docente_id: docenteId, estado: 'activo' },
      order: { fecha_creacion: 'DESC' },
      relations: ['docente', 'asignacion'],
    });
  }

  async countNoLeidas(docenteId: number): Promise<{ count: number }> {
    const count = await this.notiRepo.count({
      where: { docente_id: docenteId, estado: 'activo', leida: false },
    });
    return { count };
  }

  async findAll(): Promise<NotificacionesDocentes[]> {
    return await this.notiRepo.find({
      where: { estado: 'activo' },
      order: { fecha_creacion: 'DESC' },
      relations: ['docente', 'asignacion'],
    });
  }

  async findOne(id: number): Promise<NotificacionesDocentes> {
    const noti = await this.notiRepo.findOne({
      where: { id, estado: 'activo' },
      relations: ['docente', 'asignacion'],
    });
    if (!noti) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada o inactiva`);
    }
    return noti;
  }

  async update(id: number, updateDto: UpdateNotificacionesDocentesDto): Promise<NotificacionesDocentes> {
    const noti = await this.findOne(id);

    if (updateDto.leida === true) {
      (updateDto as any).fecha_leida = new Date();
    } else if (updateDto.leida === false) {
      (updateDto as any).fecha_leida = null;
    }

    Object.assign(noti, updateDto);
    return await this.notiRepo.save(noti);
  }

  async markAsRead(id: number): Promise<NotificacionesDocentes> {
    const noti = await this.findOne(id);
    if (noti.leida) return noti;

    noti.leida = true;
    noti.fecha_leida = new Date();
    return await this.notiRepo.save(noti);
  }

  async remove(id: number): Promise<NotificacionesDocentes> {
    const noti = await this.findOne(id);
    noti.estado = 'inactivo';
    return await this.notiRepo.save(noti);
  }

  async crearNotificacionAsignacion(
    docenteId: number,
    mensaje: string,
    asignacionId?: number,
  ): Promise<NotificacionesDocentes> {
    const createDto: CreateNotificacionesDocentesDto = {
      docente_id: docenteId,
      tipo: 'asignacion_curso',
      mensaje,
      asignacion_id: asignacionId,
      estado: 'activo',
    };
    return this.create(createDto);
  }
}