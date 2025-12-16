import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horarios } from './horarios.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horarios)
    private repo: Repository<Horarios>,
  ) {}

  async crearHorario(dto: CreateHorarioDto): Promise<Horarios> {
    return this.repo.save(this.repo.create(dto));
  }

  async listarHorarios(): Promise<Horarios[]> {
    return this.repo.find({
      where: { estado: 'activo' },
    });
  }

  async listarHorariosInactivas(): Promise<Horarios[]> {
    return this.repo.find({
      where: { estado: 'inactivo' },
    });
  }

  async findOne(id: number): Promise<Horarios> {
    const horario = await this.repo.findOneBy({ id });
    if (!horario) throw new Error('Horario no encontrado');
    return horario;
  }

  async actualizarHorario(
    id: number,
    dto: UpdateHorarioDto,
  ): Promise<Horarios> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async reactivarHorario(id: number): Promise<Horarios> {
    const horario = await this.repo.findOne({ where: { id } });
    if (!horario) {
      throw new Error('Horario no encontrada');
    }

    horario.estado = 'activo';
    return this.repo.save(horario);
  }

  async eliminarHorario(id: number): Promise<Horarios> {
    const horario = await this.repo.findOne({ where: { id } });
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    horario.estado = 'inactivo';
    return this.repo.save(horario);
  }
}
