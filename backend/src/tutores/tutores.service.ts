import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutores } from './tutores.entity';
import { CreateTutoresDto } from './dto/create-tutores.dto';
import { Curso } from '../cursos/cursos.entity';
import { Personal } from '../personal/personal.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Injectable()
export class TutoresService {
  constructor(
    @InjectRepository(Tutores)
    private readonly tutoresRepository: Repository<Tutores>,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
  ) {}

  async getTutores(): Promise<Tutores[]> {
    return this.tutoresRepository.find({
      relations: ['personal', 'curso'],
      where: { estado: 'activo' },
    });
  }

  async createTutores(dto: CreateTutoresDto): Promise<Tutores> {
    const personal = await this.personalRepository.findOne({
      where: { id: dto.idPersonal },
    });

    if (!personal) {
      throw new Error('El personal no existe');
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { personal: { id: dto.idPersonal } },
      relations: ['rol'],
    });

    if (!usuario.rol) {
      throw new Error('Este personal no tiene asignado un rol');
    }
    if (usuario.rol.nombre.toLowerCase() !== 'docente') {
      throw new Error('Este personal no tiene el rol docente');
    }

    const curso = await this.cursosRepository.findOne({
      where: { id: dto.idCurso },
    });

    if (!curso) {
      throw new Error('El curso no existe');
    }

    const tutor = this.tutoresRepository.create({
      personal: personal,
      curso: curso,
    });

    return this.tutoresRepository.save(tutor);
  }

  async updateTutor(id: number, dto: CreateTutoresDto): Promise<Tutores> {
    const tutor = await this.tutoresRepository.findOne({ where: { id } });

    if (!tutor) {
      throw new Error('Tutor no encontrado');
    }

    const personal = await this.personalRepository.findOne({
      where: { id: dto.idPersonal },
    });

    if (!personal) {
      throw new Error('El personal no existe');
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { personal: { id: personal.id } },
      relations: ['rol'],
    });

    if (!usuario || usuario.rol.nombre.toLowerCase() !== 'docente') {
      throw new Error('El personal no tiene rol Docente y no puede ser Tutor');
    }

    const curso = await this.cursosRepository.findOne({
      where: { id: dto.idCurso },
    });

    if (!curso) {
      throw new Error('El curso no existe');
    }

    tutor.personal = personal;
    tutor.curso = curso;

    return this.tutoresRepository.save(tutor);
  }

  async deleteTutores(id: number): Promise<Tutores> {
    const tutor = await this.tutoresRepository.findOne({ where: { id } });
    if (!tutor) {
      throw new Error('Tutor no encontrado');
    }
    tutor.estado = 'inactivo';
    return this.tutoresRepository.save(tutor);
  }
}
