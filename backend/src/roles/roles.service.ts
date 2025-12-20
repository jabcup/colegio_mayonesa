import { Injectable, NotFoundException } from '@nestjs/common';
import { Roles } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolRepository: Repository<Roles>,
  ) {}

  async createRol(dtoRol: CreateRolDto): Promise<Roles> {
    const rol = this.rolRepository.create(dtoRol);
    return this.rolRepository.save(rol);
  }

  async getRoles(): Promise<Roles[]> {
    return this.rolRepository.find();
  }
  async findOne(id: number): Promise<Roles> {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }
  async update(id: number, dto: UpdateRolDto): Promise<Roles> {
    await this.findOne(id);
    await this.rolRepository.update(id, dto);
    return this.findOne(id);
  }

  async deleteRol(id: number): Promise<Roles> {
    const rol = await this.rolRepository.findOne({ where: { id } });
    if (!rol) {
      throw new Error('Personal no encontrado');
    }
    rol.estado = 'inactivo';
    return this.rolRepository.save(rol);
  }
}
