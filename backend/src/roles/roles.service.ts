import { Injectable } from '@nestjs/common';
import { Roles } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';

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
}
