import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificaciones } from './notificaciones.entity';
import { CreateNotificacionesDto } from './dto/create-notificaciones.dto';
import { UpdateNotificacionesDto } from './dto/update-notificaciones.dto';

@Injectable()
export class NotificacionesService {
    constructor(
        @InjectRepository(Notificaciones)
        private repo: Repository<Notificaciones>,
    ){}

    async crearNotificacion(dto: CreateNotificacionesDto): Promise<Notificaciones>{
        const nuevaNotificacion = this.repo.create(dto);
        return this.repo.save(nuevaNotificacion);
    }

    async listarNotificaciones(): Promise<Notificaciones[]>{
        return this.repo.find();
    }

    async findOne(id: number): Promise<Notificaciones> {
        const notificacion = await this.repo.findOneBy({ id });
        if (!notificacion) throw new Error('Notificación no encontrada');
        return notificacion;
    }

    async actualizarNotificacion(id: number, dto: UpdateNotificacionesDto): Promise<Notificaciones>{
        await this.findOne(id); // Valida existencia
        await this.repo.update(id, dto);
        return this.findOne(id); // Devuelve notificación actualizada
    }

    async eliminarNotificacion(id: number): Promise<Notificaciones>{
        const notificacion = await this.repo.findOne({ where: { id } });
        if (!notificacion) {
            throw new Error('Notificación no encontrada');
        }
        notificacion.estado = 'inactivo';
        return this.repo.save(notificacion);
    }
}
