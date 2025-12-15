import { Injectable } from '@nestjs/common';
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
      relations: ['materia', 'estudiante'], // asignacionClase
    });
  }

  //CAMBIO DE MATERIA POR ASIGNACION
  async getCalificacionesPorAsignacion(
    // idAsignacion: number,
    idMateria: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        materia: { id: idMateria },
        // asignacionClase: { id: idAsignacion },
      },
      relations: ['materia', 'estudiante'], // asignacionClase
    });
  }

  async getCalificacionesPorCursoYMateria(idCurso: number, idMateria: number) {
    return this.calificacionesRepository
      .createQueryBuilder('calificacion')
      .leftJoinAndSelect('calificacion.estudiante', 'estudiante')
      .leftJoinAndSelect('calificacion.materia', 'materia')
      .leftJoin(
        'asignacion_clases',
        'asignacion',
        'asignacion.idMateria = materia.id',
      )
      .leftJoin('asignacion.curso', 'curso')
      .where('materia.id = :idMateria', { idMateria })
      .andWhere('curso.id = :idCurso', { idCurso })
      .andWhere('calificacion.estado = "activo"')
      .select([
        'calificacion.id',
        'calificacion.calificacion',
        'calificacion.aprobacion',
        'estudiante.id',
        'estudiante.nombres',
        'estudiante.apellidoPat',
        'estudiante.apellidoMat',
        'materia.id',
        'materia.nombre',
      ])
      .getRawMany();
  }

  async getCalificacionesPorEstudiante(
    idEstudiante: number,
  ): Promise<Calificaciones[]> {
    return this.calificacionesRepository.find({
      where: {
        estudiante: { id: idEstudiante },
      },
      relations: ['materia', 'estudiante'], // asignacionClase
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
      },
      relations: ['materia', 'estudiante'],
    });
  }

  async createCalificacion(
    dto: CreateCalificacionDto,
  ): Promise<Calificaciones> {
    // const asignacion = await this.asignacionClaseRepository.findOne({
    //   where: { id: dto.idAsignacion },
    // });

    const materia = await this.materiasRepository.findOne({
      where: { id: dto.idMateria },
    });

    if (!materia) {
      throw new Error('Materia no encontrada');
    }

    // if (!asignacion) {
    //   throw new Error('Asignacion no encontrada');
    // }

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: dto.idEstudiante },
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const aprobacion = dto.calificacion >= 51 ? true : false;

    // Crear calificación
    const calificacion = this.calificacionesRepository.create({
      calificacion: dto.calificacion,
      aprobacion: aprobacion,
      materia: materia,
      //asignacionClase: asignacion,
      estudiante: estudiante,
    });

    return this.calificacionesRepository.save(calificacion);
  }

  async updateCalificacion(id: number, dto: UpdateCalificacionDto) {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
    });

    if (!calificacion) {
      throw new Error('Calificacion no encontrada');
    }

    const new_aprobacion = dto.calificacion >= 51 ? true : false;

    calificacion.calificacion = dto.calificacion;
    calificacion.aprobacion = new_aprobacion;

    return this.calificacionesRepository.save(calificacion);
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
