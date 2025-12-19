import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Calificaciones } from './calificaciones.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
// import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificaciones)
    private readonly calificacionesRepository: Repository<Calificaciones>,

    // @InjectRepository(AsignacionClase)
    // private readonly asignacionClaseRepository: Repository<AsignacionClase>,

    @InjectRepository(Materias)
    private readonly materiasRepository: Repository<Materias>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async getCalificaciones(): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      relations: ['materia', 'estudiante'],
    });
  }
  async getCalificacionesPorAsignacion(
    idMateria: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        materia: { id: idMateria },
      },
      relations: ['materia', 'estudiante'],
    });
  }

  async getCalificacionesPorCursoYMateria(idCurso: number, idMateria: number) {
    const anioEscolar = new Date().getFullYear(); // 2025

    return await this.estudianteRepository
      .createQueryBuilder('e')
      // Join directo con la tabla pivote estudiante_curso
      .innerJoin(
        'estudiante_curso',
        'ec',
        'ec.idEstudiante = e.id AND ec.estado = :estadoEc',
        { estadoEc: 'activo' },
      )
      // Join con el curso
      .innerJoin(
        'cursos',
        'c',
        'c.id = ec.idCurso AND c.estado = :estadoCurso',
        { estadoCurso: 'activo' },
      )
      // Left join con calificaciones (puede no existir)
      .leftJoin(
        'calificaciones',
        'cal',
        'cal.idEstudiante = e.id ' +
          'AND cal.idMateria = :idMateria ' +
          'AND cal.anioEscolar = :anioEscolar ' +
          'AND cal.estado = :estadoCal',
        { idMateria, anioEscolar, estadoCal: 'activo' },
      )
      // Filtro por curso
      .where('c.id = :idCurso', { idCurso })
      // Selección de campos
      .select([
        'e.id AS estudiante_id',
        'e.nombres AS estudiante_nombres',
        'e.apellidoPat AS estudiante_apellido_pat',
        'e.apellidoMat AS estudiante_apellido_mat',
        'cal.id AS calificacion_id',
        'cal.trim1 AS trim1',
        'cal.trim2 AS trim2',
        'cal.trim3 AS trim3',
        'cal.calificacionFinal AS calificacion_final',
        'cal.aprobacion AS aprobacion',
      ])
      // Parámetros
      .setParameter('idMateria', idMateria)
      .setParameter('anioEscolar', anioEscolar)
      .setParameter('idCurso', idCurso)
      .getRawMany()
      .then((rows) =>
        rows.map((row) => ({
          calificacion_id: row.calificacion_id || null,
          trim1: row.trim1 ? Number(row.trim1) : null,
          trim2: row.trim2 ? Number(row.trim2) : null,
          trim3: row.trim3 ? Number(row.trim3) : null,
          calificacion_final: row.calificacion_final
            ? Number(row.calificacion_final)
            : null,
          aprobacion: Boolean(row.aprobacion),
          estudiante: {
            id: row.estudiante_id,
            nombres: row.estudiante_nombres,
            apellidoPat: row.estudiante_apellido_pat,
            apellidoMat: row.estudiante_apellido_mat,
          },
        })),
      );
  }

  async getCalificacionesPorEstudiante(
    idEstudiante: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        estudiante: { id: idEstudiante },
      },
      relations: ['materia', 'estudiante'],
    });
  }
  async getCalificacionesPorEstudianteGestionActual(
    idEstudiante: number,
  ): Promise<Calificaciones[]> {
    const gestionActual = new Date().getFullYear();

    return this.calificacionesRepository.find({
      where: {
        estudiante: { id: idEstudiante },
        fecha_creacion: Between(
          new Date(gestionActual, 0, 1), // 1 enero del año actual
          new Date(gestionActual, 11, 31, 23, 59, 59, 999), // 31 diciembre 23:59:59
        ),
        estado: 'activo',
      },
      relations: ['materia', 'estudiante'],
    });
  }

  async createCalificacion(
    dto: CreateCalificacionDto,
  ): Promise<Calificaciones> {
    // Validar materia
    const materia = await this.materiasRepository.findOne({
      where: { id: dto.idMateria },
    });
    if (!materia) {
      throw new NotFoundException(
        `Materia con ID ${dto.idMateria} no encontrada`,
      );
    }

    // Validar estudiante
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: dto.idEstudiante },
    });
    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con ID ${dto.idEstudiante} no encontrado`,
      );
    }

    const existente = await this.calificacionesRepository.findOne({
      where: {
        estudiante: { id: dto.idEstudiante },
        materia: { id: dto.idMateria },
        anioEscolar: dto.anioEscolar,
      },
    });

    if (existente) {
      throw new BadRequestException(
        `Ya existe un registro de calificaciones para este estudiante en la materia ID ${dto.idMateria} para el año ${dto.anioEscolar}. Usa PATCH para actualizar.`,
      );
    }

    // Calcular promedio solo con los trimestres que tengan nota
    const notas = [dto.trim1, dto.trim2, dto.trim3].filter(
      (n) => n !== undefined && n !== null,
    );
    const calificacionFinal =
      notas.length > 0
        ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2))
        : null;

    // Determinar aprobación (ajusta el 61 según tu regla: 61, 70, etc.)
    const aprobacion = calificacionFinal !== null && calificacionFinal >= 51;

    // Crear nueva calificación
    const nuevaCalificacion = this.calificacionesRepository.create({
      materia,
      estudiante,
      anioEscolar: dto.anioEscolar,
      trim1: dto.trim1 ?? null,
      trim2: dto.trim2 ?? null,
      trim3: dto.trim3 ?? null,
      calificacionFinal,
      aprobacion,
      estado: 'activo',
    });

    return await this.calificacionesRepository.save(nuevaCalificacion);
  }

  async updateCalificacion(
    id: number,
    dto: UpdateCalificacionDto,
  ): Promise<Calificaciones> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
      relations: ['materia', 'estudiante'],
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }
    console.log('calificacion', calificacion);

    // Actualizar trimestres
    if (dto.trim1 !== undefined) calificacion.trim1 = dto.trim1;
    if (dto.trim2 !== undefined) calificacion.trim2 = dto.trim2;
    if (dto.trim3 !== undefined) calificacion.trim3 = dto.trim3;

    // Obtener solo valores numéricos válidos
    const notas = [
      calificacion.trim1,
      calificacion.trim2,
      calificacion.trim3,
    ].filter((n): n is number => typeof n === 'number' && !isNaN(n));

    console.log('notas', notas);

    // Calcular promedio de forma segura
    if (notas.length > 0) {
      const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
      // Redondear a 2 decimales de forma segura
      calificacion.calificacionFinal = Math.round(promedio * 100) / 100;
    } else {
      calificacion.calificacionFinal = null;
    }

    console.log('Calificacion Final', calificacion.calificacionFinal);
    // Aprobación
    calificacion.aprobacion =
      calificacion.calificacionFinal !== null &&
      calificacion.calificacionFinal >= 51;

    return await this.calificacionesRepository.save(calificacion);
  }

  async deleteCalificacion(id: number): Promise<Calificaciones> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
    });

    if (!calificacion) {
      throw new Error('Calificacion no encontrada');
    }

    calificacion.estado = 'inactivo';
    return this.calificacionesRepository.save(calificacion);
  }
}
