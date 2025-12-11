import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { UpdateAsignacionFulDto } from './dto/update-asignacion-full.dto';
import { Horarios } from 'src/horarios/horarios.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

@Injectable()
export class AsignacionClasesService {
  constructor(
    @InjectRepository(AsignacionClase)
    private readonly asignacionRepository: Repository<AsignacionClase>,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Materias)
    private readonly materiaRepository: Repository<Materias>,
    @InjectRepository(Horarios)
    private readonly horarioRepository: Repository<Horarios>,
    private dataSource: DataSource,
  ) { }

  async createAsignacionFull(dto: CreateAsignacionFulDto) {
    return this.dataSource.transaction(async (manager) => {
      const asignacion = manager.create(AsignacionClase, {
        dia: dto.dia,
      });

      const nuevaAsignacion = await manager.save(asignacion);

      const docente = await manager.findOne(Personal, {
        where: { id: dto.idPersonal },
      });

      if (!docente) {
        throw new Error('Docente no encontrado');
      }

      const curso = await manager.findOne(Curso, {
        where: { id: dto.idCurso },
      });

      if (!curso) {
        throw new Error('Curso no encontrado');
      }

      const materia = await manager.findOne(Materias, {
        where: { id: dto.idMateria },
      });

      if (!materia) {
        throw new Error('Materia no encontrado');
      }

      const horario = await manager.findOne(Horarios, {
        where: { id: dto.idHorario },
      });

      if (!horario) {
        throw new Error('Horario no encontrado');
      }

      return {
        message: 'Asignacion de curso creado exitosamente',
        asignacion: nuevaAsignacion,
        docente: docente,
        curso: curso,
        materia: materia,
        horario: horario,
      };
    });
  }

  async findAllAsignaciones() {
    const asignaciones = await this.asignacionRepository.find({
      relations: ['personal', 'curso', 'materia', 'horario'],
    });
    return asignaciones;
  }

  async findAsignacionById(id: number) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
      relations: ['personal', 'curso', 'materia', 'horario'],
    });
    return asignacion;
  }

  async updateAsignacion(id: number, dto: UpdateAsignacionFulDto) {
    return this.dataSource.transaction(async (manager) => {
      const asignacion = await manager.findOne(AsignacionClase, {
        where: { id },
      });
      if (!asignacion) {
        throw new Error('Asignacion no encontrada');
      }
      asignacion.dia = dto.dia || asignacion.dia;
      return await manager.save(asignacion);
    });
  }

  async deleteAsignacion(id: number){
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
    });
    if (!asignacion) {
      throw new Error('Asignacion no encontrada');
    }
    asignacion.estado = 'inactivo';
    return await this.asignacionRepository.save(asignacion);
  }

  }
