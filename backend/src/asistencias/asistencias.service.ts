import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Asistencias } from './asistencias.entity';
import { AsignacionClase } from 'src/asignacion-clases/asignacionCursos.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencias)
    private readonly asistenciaRepository: Repository<Asistencias>,
    @InjectRepository(AsignacionClase)
    private readonly asignacionRepository: Repository<AsignacionClase>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    private dataSource: DataSource,
  ) {}

  async getAsistencias(): Promise<Asistencias[]> {
    return this.asistenciaRepository.find({
      relations: ['asignacionClase', 'estudiante'],
    });
  }

  async createAsistencia(dto: CreateAsistenciaDto) {
    return this.dataSource.transaction(async (manager) => {
      const fechaHoy = new Date().toISOString().split('T')[0];
      const asistenciaExistente = await this.asistenciaRepository.findOne({
        where: {
          asignacionClase: { id: dto.idAsignacion },
          estudiante: { id: dto.idEstudiante },
        },
      });

      if (asistenciaExistente) {
        throw new Error(
          'La asistencia de hoy ya fue registrada para este estudiante.',
        );
      }

      const asignacion = await this.asignacionRepository.findOne({
        where: { id: dto.idAsignacion },
      });
      if (!asignacion) {
        throw new Error('Asignación no encontrada');
      }

      const estudiante = await this.estudianteRepository.findOne({
        where: { id: dto.idEstudiante },
      });
      if (!estudiante) {
        throw new Error('Estudiante no encontrado');
      }

      const asistencia = manager.create(Asistencias, {
        asistencia: 'presente',
        asignacionClase: asignacion,
        estudiante: estudiante,
      });

      const nuevaAsistencia = await manager.save(asistencia);

      return {
        message: 'Asistencia creada exitosamente',
        asistencia: nuevaAsistencia,
      };
    });
  }

  async findAll() {
    return this.asistenciaRepository.find({
      relations: ['asignacionClase', 'estudiante'],
    });
  }

  async findOne(id: number) {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id },
      relations: ['asignacionClase', 'estudiante'],
    });
    if (!asistencia) {
      throw new Error('Asistencia no encontrada');
    }
    return asistencia;
  }

  async updateAsistencia(id: number, dto: UpdateAsistenciaDto) {
    return this.dataSource.transaction(async (manager) => {
      const asistencia = await manager.findOne(Asistencias, { where: { id } });
      if (!asistencia) {
        throw new Error('Asistencia no encontrada');
      }
      const asignacion = await manager.findOne(AsignacionClase, {
        where: { id: dto.idAsignacion },
      });
      if (!asignacion) {
        throw new Error('Asignación no encontrada');
      }
      const estudiante = await manager.findOne(Estudiante, {
        where: { id: dto.idEstudiante },
      });
      if (!estudiante) {
        throw new Error('Estudiante no encontrado');
      }
      const validAsistencias = [
        'presente',
        'falta',
        'ausente',
        'justificativo',
      ];
      if (!validAsistencias.includes(dto.asistencia)) {
        throw new BadRequestException('Valor de asistencia inválido');
      }
      asistencia.asistencia = dto.asistencia as
        | 'presente'
        | 'falta'
        | 'ausente'
        | 'justificativo';
      asistencia.asignacionClase = asignacion;
      asistencia.estudiante = estudiante;
      const updatedAsistencia = await manager.save(asistencia);
      return {
        message: 'Asistencia actualizada exitosamente',
        asistencia: updatedAsistencia,
      };
    });
  }

  async remove(id: number): Promise<Asistencias> {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id },
    });
    if (!asistencia) {
      throw new Error('Asistencia no encontrada');
    }
    asistencia.estado = 'inactivo';
    return this.asistenciaRepository.save(asistencia);
  }
}
