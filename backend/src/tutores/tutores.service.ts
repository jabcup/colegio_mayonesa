import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
      relations: ['personal', 'curso', 'curso.paralelo'],
      where: { estado: 'activo' },
    });
  }

  async createTutores(dto: CreateTutoresDto): Promise<Tutores> {
    const personal = await this.personalRepository.findOne({
      where: { id: dto.idPersonal },
    });

    if (!personal) {
      throw new NotFoundException('El personal no existe');
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { personal: { id: dto.idPersonal } },
      relations: ['rol'],
    });

    if (!usuario || !usuario.rol) {
      throw new BadRequestException('Este personal no tiene rol asignado');
    }

    if (usuario.rol.nombre.toLowerCase() !== 'docente') {
      throw new BadRequestException('Este personal no tiene el rol Docente');
    }

    const curso = await this.cursosRepository.findOne({
      where: { id: dto.idCurso },
    });

    if (!curso) {
      throw new NotFoundException('El curso no existe');
    }

    const gestionActual = new Date().getFullYear();

    const estaAsignado = await this.tutoresRepository.findOne({
      where: {
        personal: { id: dto.idPersonal },
        curso: { gestion: gestionActual },
        estado: 'activo',
      },
    });

    if (estaAsignado) {
      throw new BadRequestException(
        'El personal ya está asignado a un curso en la gestión actual',
      );
    }

    const tutor = this.tutoresRepository.create({
      personal,
      curso,
    });

    return this.tutoresRepository.save(tutor);
  }

  async updateTutor(id: number, dto: CreateTutoresDto): Promise<Tutores> {
    const tutor = await this.tutoresRepository.findOne({
      where: { id },
      relations: ['curso', 'personal'],
    });

    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    const personal = await this.personalRepository.findOne({
      where: { id: dto.idPersonal },
    });

    if (!personal) {
      throw new NotFoundException('El personal no existe');
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { personal: { id: personal.id } },
      relations: ['rol'],
    });

    if (!usuario || usuario.rol.nombre.toLowerCase() !== 'docente') {
      throw new BadRequestException(
        'El personal no tiene rol Docente y no puede ser Tutor',
      );
    }

    const cursoNuevo = await this.cursosRepository.findOne({
      where: { id: dto.idCurso },
    });

    if (!cursoNuevo) {
      throw new NotFoundException('El curso no existe');
    }

    const gestionNueva = cursoNuevo.gestion;

    const tutorExistente = await this.tutoresRepository.findOne({
      where: {
        personal: { id: dto.idPersonal },
        curso: { gestion: gestionNueva },
        estado: 'activo',
      },
      relations: ['curso'],
    });

    if (tutorExistente && tutorExistente.id !== tutor.id) {
      throw new BadRequestException(
        `El personal ya está asignado a otro curso en la gestión ${gestionNueva}`,
      );
    }

    tutor.personal = personal;
    tutor.curso = cursoNuevo;

    return this.tutoresRepository.save(tutor);
  }

  async deleteTutores(id: number): Promise<Tutores> {
    const tutor = await this.tutoresRepository.findOne({ where: { id } });

    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    tutor.estado = 'inactivo';
    return this.tutoresRepository.save(tutor);
  }
}
