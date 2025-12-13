import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between } from 'typeorm';
import { Asistencias } from './asistencias.entity';
import { AsignacionClase } from 'src/asignacion-clases/asignacionCursos.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

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
      const fechaHoyStart = new Date(fechaHoy);
      const fechaHoyEnd = new Date(fechaHoyStart);
      fechaHoyEnd.setDate(fechaHoyEnd.getDate() + 1);

      const asistenciaExistente = await this.asistenciaRepository.findOne({
        where: {
          asignacionClase: { id: dto.idAsignacion },
          estudiante: { id: dto.idEstudiante },
          fecha_creacion: Between(fechaHoyStart, fechaHoyEnd),
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

      const validAsistencias = [
        'presente',
        'falta',
        'ausente',
        'justificativo',
      ];
      if (!validAsistencias.includes(dto.asistencia)) {
        throw new BadRequestException('Valor de asistencia inválido');
      }

      const asistencia = manager.create(Asistencias, {
        asistencia: dto.asistencia as
          | 'presente'
          | 'falta'
          | 'ausente'
          | 'justificativo',
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

  async buscarAsistenciasPorCursoYMateria(idCurso: number, idMateria: number) {
    // Asumiendo que AsignacionClase tiene relaciones a Curso y Materia
    // Ajusta según la estructura real de tu entidad AsignacionClase
    const asignacion = await this.asignacionRepository.findOne({
      where: {
        curso: { id: idCurso }, // Asume que hay una relación ManyToOne a Curso
        materia: { id: idMateria }, // Asume que hay una relación ManyToOne a Materia
      },
      relations: ['materia'],
    });

    if (!asignacion) {
      return { asistencias: [] };
    }

    const asistencias = await this.asistenciaRepository.find({
      where: {
        asignacionClase: { id: asignacion.id },
        estado: 'activo',
      },
      relations: ['estudiante', 'asignacionClase', 'asignacionClase.materia'],
    });

    const asistenciasMap = asistencias.map((a) => ({
      asistencia_id: a.id,
      asistencia_asistencia: a.asistencia,
      estudiante_id: a.estudiante.id,
      estudiante_nombres: a.estudiante.nombres,
      estudiante_apellidoPat: a.estudiante.apellidoPat,
      estudiante_apellidoMat: a.estudiante.apellidoMat,
      materia_id: a.asignacionClase.materia.id,
      materia_nombre: a.asignacionClase.materia.nombre,
    }));

    return { asistencias: asistenciasMap };
  }
}
