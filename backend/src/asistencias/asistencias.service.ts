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

      const asistenciaExistente = await manager.findOne(Asistencias, {
        where: {
          asignacionClase: { id: dto.idAsignacion },
          estudiante: { id: dto.idEstudiante },
          fecha_creacion: Between(fechaHoyStart, fechaHoyEnd),
        },
      });

      if (asistenciaExistente) {
        throw new BadRequestException(
          'La asistencia de hoy ya fue registrada para este estudiante.',
        );
      }

      const asignacion = await manager.findOne(AsignacionClase, {
        where: { id: dto.idAsignacion },
      });
      if (!asignacion) {
        throw new BadRequestException('Asignación no encontrada');
      }

      const estudiante = await manager.findOne(Estudiante, {
        where: { id: dto.idEstudiante },
      });
      if (!estudiante) {
        throw new BadRequestException('Estudiante no encontrado');
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
        asistencia: dto.asistencia as 'presente' | 'falta' | 'ausente' | 'justificativo',
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

  async createBatchAsistencias(dtos: CreateAsistenciaDto[]) {
    return this.dataSource.transaction(async (manager) => {
      const nuevas = [];
      for (const dto of dtos) {
        const fechaHoy = new Date().toISOString().split('T')[0];
        const fechaHoyStart = new Date(fechaHoy);
        const fechaHoyEnd = new Date(fechaHoyStart);
        fechaHoyEnd.setDate(fechaHoyEnd.getDate() + 1);

        const existente = await manager.findOne(Asistencias, {
          where: {
            asignacionClase: { id: dto.idAsignacion },
            estudiante: { id: dto.idEstudiante },
            fecha_creacion: Between(fechaHoyStart, fechaHoyEnd),
          },
        });

        if (existente) {
          throw new BadRequestException(`La asistencia de hoy ya fue registrada para el estudiante ${dto.idEstudiante}.`);
        }

        const asignacion = await manager.findOne(AsignacionClase, { where: { id: dto.idAsignacion } });
        if (!asignacion) throw new BadRequestException('Asignación no encontrada');

        const estudiante = await manager.findOne(Estudiante, { where: { id: dto.idEstudiante } });
        if (!estudiante) throw new BadRequestException('Estudiante no encontrado');

        const validAsistencias = ['presente', 'falta', 'ausente', 'justificativo'];
        if (!validAsistencias.includes(dto.asistencia)) {
          throw new BadRequestException('Valor de asistencia inválido');
        }

        const asistencia = manager.create(Asistencias, {
          asistencia: dto.asistencia as 'presente' | 'falta' | 'ausente' | 'justificativo',
          asignacionClase: asignacion,
          estudiante: estudiante,
        });

        const nueva = await manager.save(asistencia);
        nuevas.push(nueva);
      }

      return { message: 'Asistencias creadas exitosamente', asistencias: nuevas };
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
      throw new BadRequestException('Asistencia no encontrada');
    }
    return asistencia;
  }

  async updateAsistencia(id: number, dto: UpdateAsistenciaDto) {
    return this.dataSource.transaction(async (manager) => {
      const asistencia = await manager.findOne(Asistencias, { where: { id } });
      if (!asistencia) {
        throw new BadRequestException('Asistencia no encontrada');
      }
      const asignacion = await manager.findOne(AsignacionClase, {
        where: { id: dto.idAsignacion },
      });
      if (!asignacion) {
        throw new BadRequestException('Asignación no encontrada');
      }
      const estudiante = await manager.findOne(Estudiante, {
        where: { id: dto.idEstudiante },
      });
      if (!estudiante) {
        throw new BadRequestException('Estudiante no encontrado');
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
      throw new BadRequestException('Asistencia no encontrada');
    }
    asistencia.estado = 'inactivo';
    return this.asistenciaRepository.save(asistencia);
  }

  async buscarAsistenciasPorCursoYMateria(
    idCurso: number,
    idMateria: number,
    idEstudiante?: number,
    fromDate?: string,
    toDate?: string,
  ) {
    const asignacionQuery = this.asignacionRepository.createQueryBuilder('asignacion')
      .innerJoin('asignacion.curso', 'curso')
      .innerJoin('asignacion.materia', 'materia')
      .where('curso.id = :idCurso', { idCurso })
      .andWhere('materia.id = :idMateria', { idMateria });

    const asignaciones = await asignacionQuery.getMany();

    if (asignaciones.length === 0) {
      return { asistencias: [] };
    }

    const idAsignacion = asignaciones[0].id;

    const query = this.asistenciaRepository.createQueryBuilder('asistencia')
      .innerJoinAndSelect('asistencia.estudiante', 'estudiante')
      .innerJoinAndSelect('asistencia.asignacionClase', 'asignacion')
      .innerJoinAndSelect('asignacion.materia', 'materia')
      .where('asignacion.id = :idAsignacion', { idAsignacion })
      .andWhere('asistencia.estado = :estado', { estado: 'activo' });

    if (idEstudiante) {
      query.andWhere('estudiante.id = :idEstudiante', { idEstudiante });
    }

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setDate(end.getDate() + 1);
      query.andWhere('asistencia.fecha_creacion BETWEEN :start AND :end', { start, end });
    }

    query.orderBy('asistencia.fecha_creacion', 'DESC');

    const asistencias = await query.getMany();

    const asistenciasMap = asistencias.map((a) => ({
      asistencia_id: a.id,
      asistencia_asistencia: a.asistencia,
      fecha: a.fecha_creacion,
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