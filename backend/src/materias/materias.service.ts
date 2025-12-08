import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { Materias } from './materias.entity'; 
import { CreateMateriaDto } from './dto/create-materia.dto'; 

@Injectable()
export class MateriasService {
  constructor(@InjectRepository(Materias) private repo: Repository<Materias>,){}

  async crearMateria(dto: CreateMateriaDto): Promise<Materias>{
    return this.repo.save(this.repo.create(dto));
  }

  async listarMaterias(): Promise<Materias[]>{
    return this.repo.find();
  }
}
