import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepo: Repository<Auditoria>,
  ) {}

  async registrar(data: Partial<Auditoria>) {
    const auditoria = this.auditoriaRepo.create(data);
    return this.auditoriaRepo.save(auditoria);
  }

  async obtenerAuditorias(operacion?: 'POST' | 'PUT' | 'DELETE') {
    if (operacion) {
      return this.auditoriaRepo.find({
        where: { operacion },
        order: { fecha_registro: 'DESC' },
      });
    }
    return this.auditoriaRepo.find({
      order: { fecha_registro: 'DESC' },
    });
  }
}
