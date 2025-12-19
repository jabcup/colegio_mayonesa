<<<<<<< HEAD
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
=======
import { BadRequestException, Injectable } from '@nestjs/common';
>>>>>>> charu
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

    @InjectRepository(Materias)
    private readonly materiasRepository: Repository<Materias>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  // Función auxiliar para convertir a número de forma segura
  private getNotasValidas(trim1: any, trim2: any, trim3: any): number[] {
    return [trim1, trim2, trim3]
      .map((n) => {
        if (n === null || n === undefined || n === '') return null;
        const num = Number(n);
        return isNaN(num) ? null : num;
      })
      .filter((n): n is number => n !== null);
  }

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

    const rows = await this.estudianteRepository
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
      // Left join con calificaciones
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
        //'cal.calificacionFinal AS calificacion_final',
        'cal.aprobacion AS aprobacion',
      ])
      // Parámetros
      .setParameter('idMateria', idMateria)
      .setParameter('anioEscolar', anioEscolar)
      .setParameter('idCurso', idCurso)
      .getRawMany();

    return rows.map((row) => ({
      calificacion_id: row.calificacion_id || null,
      trim1: row.trim1 !== null ? Number(row.trim1) : null,
      trim2: row.trim2 !== null ? Number(row.trim2) : null,
      trim3: row.trim3 !== null ? Number(row.trim3) : null,
      aprobacion: row.aprobacion !== null ? Boolean(row.aprobacion) : null, // null si no hay calificación
      estudiante: {
        id: row.estudiante_id,
        nombres: row.estudiante_nombres,
        apellidoPat: row.estudiante_apellido_pat,
        apellidoMat: row.estudiante_apellido_mat,
      },
    }));
    // .then((rows) =>
    //   rows.map((row) => ({
    //     calificacion_id: row.calificacion_id || null,
    //     trim1: row.trim1 ? Number(row.trim1) : null,
    //     trim2: row.trim2 ? Number(row.trim2) : null,
    //     trim3: row.trim3
    //       ? Number(row.trim3)
    //       : null
    //         ? //calificacion_final: row.calificacion_final
    //           Number(row.calificacion_final)
    //         : null,
    //     aprobacion: Boolean(row.aprobacion),
    //     estudiante: {
    //       id: row.estudiante_id,
    //       nombres: row.estudiante_nombres,
    //       apellidoPat: row.estudiante_apellido_pat,
    //       apellidoMat: row.estudiante_apellido_mat,
    //     },
    //   })),
    // );
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
          new Date(gestionActual, 0, 1),
          new Date(gestionActual, 11, 31, 23, 59, 59, 999),
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

<<<<<<< HEAD
    const existente = await this.calificacionesRepository.findOne({
      where: {
        estudiante: { id: dto.idEstudiante },
        materia: { id: dto.idMateria },
        anioEscolar: dto.anioEscolar,
      },
=======
    // const existe = await this.calificacionesRepository.findOne({
    //   where: {
    //     estudiante: { id: dto.idEstudiante },
    //     materia: { id: dto.idMateria },
    //     trimestre: dto.trimestre,
    //     anioEscolar: dto.anioEscolar,
    //   },
    // });

    // if (existe) {
    //   throw new BadRequestException(
    //     `Ya existe una calificación para este estudiante en la materia ${materia.nombre || dto.idMateria}, trimestre ${dto.trimestre} del año ${dto.anioEscolar}`,
    //   );
    // }

    const aprobacion = dto.calificacion >= 51 ? true : false;

    const calificacion = this.calificacionesRepository.create({
      calificacion: dto.calificacion,
      aprobacion: aprobacion,
      materia: materia,
      estudiante: estudiante,
      //trimestre: dto.trimestre,
      //anioEscolar: dto.anioEscolar,
>>>>>>> charu
    });

    if (existente) {
      throw new BadRequestException(
        `Ya existe un registro de calificaciones para este estudiante en la materia ID ${dto.idMateria} para el año ${dto.anioEscolar}. Usa PATCH para actualizar.`,
      );
    }

    // Calcular promedio solo con los trimestres que tengan nota
    // const notas = [dto.trim1, dto.trim2, dto.trim3].filter(
    //   (n) => n !== undefined && n !== null,
    // );
    // const calificacionFinal =
    //   notas.length > 0
    //     ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2))
    //     : null;

    const notas = this.getNotasValidas(dto.trim1, dto.trim2, dto.trim3);

    console.log('notas create:', notas);

    const promedioTemporal =
      notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : null;

    console.log('Promedio: ' + promedioTemporal);

    // Determinar aprobación (ajusta el 61 según tu regla: 61, 70, etc.)
    const aprobacion = promedioTemporal !== null && promedioTemporal >= 51;

    // Crear nueva calificación
    const nuevaCalificacion = this.calificacionesRepository.create({
      materia,
      estudiante,
      anioEscolar: dto.anioEscolar,
      trim1: dto.trim1 ?? null,
      trim2: dto.trim2 ?? null,
      trim3: dto.trim3 ?? null,
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

    const notas = this.getNotasValidas(
      calificacion.trim1,
      calificacion.trim2,
      calificacion.trim3,
    );

    console.log('notas update:', notas);

    const promedioTemporal =
      notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : null;

    console.log('Promedio: ' + promedioTemporal);

    // Actualizar aprobación
    calificacion.aprobacion =
      promedioTemporal !== null && promedioTemporal >= 51;

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
