import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Avisos } from './avisos.entity';
import { CreateAvisosDto } from './dto/create-avisos.dto';
import { UpdateAvisosDto } from './dto/update-avisos.dto';
import { Curso } from '../cursos/cursos.entity';
import { Personal } from '../personal/personal.entity';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Avisos)
    private readonly avisosRepository: Repository<Avisos>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    private dataSource: DataSource,
  ) {}

  async crearAviso(dto: CreateAvisosDto) {
    return this.dataSource.transaction(async (manager) => {
      const curso = await manager.findOne(Curso, {
        where: { id: dto.idCurso },
      });

      if (!curso) {
        throw new Error('Curso no encontrado');
      }

      const personal = await manager.findOne(Personal, {
        where: { id: dto.idPersonal },
      });

      if (!personal) {
        throw new Error('Personal no encontrado');
      }

      const aviso = manager.create(Avisos, {
        asunto: dto.asunto,
        mensaje: dto.mensaje,
        estado: 'activo',
        Curso: curso,
        Personal: personal,
      });

      const nuevoAviso = await manager.save(aviso);

      return {
        message: 'Aviso creado exitosamente',
        aviso: nuevoAviso,
      };
    });
  }

  async obtenerAvisosPorCurso(curso: Curso): Promise<Avisos[]> {
    return this.avisosRepository.find({
      where: { Curso: curso, estado: 'activo' },
      relations: ['Curso', 'Personal'],
    });
  }

  async findOne(id: number): Promise<Avisos> {
    const aviso = await this.avisosRepository.findOne({
      where: { id },
      relations: ['Curso', 'Personal'],
    });
    if (!aviso) throw new Error('Aviso no encontrado');
    return aviso;
  }

  async actualizarAviso(id: number, dto: UpdateAvisosDto): Promise<Avisos> {
    return this.dataSource.transaction(async (manager) => {
      const aviso = await this.findOne(id); // Valida existencia

      if (dto.idCurso) {
        const curso = await manager.findOne(Curso, {
          where: { id: dto.idCurso },
        });
        if (!curso) throw new Error('Curso no encontrado');
        aviso.Curso = curso;
      }

      if (dto.idPersonal) {
        const personal = await manager.findOne(Personal, {
          where: { id: dto.idPersonal },
        });
        if (!personal) throw new Error('Personal no encontrado');
        aviso.Personal = personal;
      }

      Object.assign(aviso, {
        asunto: dto.asunto || aviso.asunto,
        mensaje: dto.mensaje || aviso.mensaje,
      });

      await manager.save(aviso);
      return this.findOne(id); // Devuelve aviso actualizado con relaciones
    });
  }

  async eliminarAviso(id: number): Promise<Avisos> {
    const aviso = await this.avisosRepository.findOne({ where: { id } });
    if (!aviso) {
      throw new Error('Aviso no encontrado');
    }
    aviso.estado = 'inactivo';
    return this.avisosRepository.save(aviso);
  }
}
