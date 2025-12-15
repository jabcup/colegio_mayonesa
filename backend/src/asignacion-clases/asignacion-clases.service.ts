import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { UpdateAsignacionFulDto } from './dto/update-asignacion-full.dto';
import { Horarios } from 'src/horarios/horarios.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';

@Injectable()
export class AsignacionClasesService {
  constructor(
    @InjectRepository(AsignacionClase)
    private readonly asignacionRepository: Repository<AsignacionClase>,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>,
    @InjectRepository(Materias)
    private readonly materiaRepository: Repository<Materias>,
    @InjectRepository(Horarios)
    private readonly horarioRepository: Repository<Horarios>,
    private dataSource: DataSource,
  ) {}
  async createAsignacionFull(
    dtoAsignacion: CreateAsignacionFulDto,
  ): Promise<AsignacionClase> {
    return this.asignacionRepository.save(
      this.asignacionRepository.create({
        dia: dtoAsignacion.dia,
        personal: { id: dtoAsignacion.idPersonal },
        curso: { id: dtoAsignacion.idCurso },
        materia: { id: dtoAsignacion.idMateria },
        horario: { id: dtoAsignacion.idHorario },
      }),
    );
  }
  async getCursosPorDocente(idDocente: number) {
    return this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoin('asignacion.curso', 'curso')
      .leftJoin('asignacion.personal', 'personal')
      .where('personal.id = :idDocente', { idDocente })
      .select([
        'curso.id AS id',
        'curso.nombre AS nombre',
        'curso.paralelo AS paralelo',
      ])
      .distinct(true)
      .getRawMany();
  }

  async getMateriasPorDocenteYCurso(idDocente: number, idCurso: number) {
    return this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoin('asignacion.materia', 'materia')
      .leftJoin('asignacion.personal', 'personal')
      .leftJoin('asignacion.curso', 'curso')
      .where('personal.id = :idDocente', { idDocente })
      .andWhere('curso.id = :idCurso', { idCurso })
      .select(['materia.id AS id', 'materia.nombre AS nombre'])
      .distinct(true)
      .getRawMany();
  }

  async getAsignacionesPorEstudiante(idEstudiante: number) {
    // 1. Obtener curso activo del estudiante usando QueryBuilder
    const cursoActual: EstudianteCurso =
      await this.estudianteCursoRepository.findOne({
        where: {
          estudiante: { id: idEstudiante },
          estado: 'activo',
        },
        relations: ['curso', 'estudiante'],
      });

    if (!cursoActual) {
      throw new Error('El estudiante no tiene curso activo asignado');
    }
    const idCurso = cursoActual.curso.id;

    return this.asignacionRepository.find({
      select: {
        id: true,
        dia: true,
        curso: { nombre: true, paralelo: true },
        materia: { nombre: true },
        horario: { horario: true },
      },
      where: { curso: { id: idCurso } },
      relations: ['materia', 'horario'], //Si se desea tener datos del docente se debe agregar personal al relation
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

  //     if (!docente) {
  //       throw new Error('Docente no encontrado');
  //     }

  //     const curso = await manager.findOne(Curso, {
  //       where: { id: dto.idCurso },
  //     });

  //     if (!curso) {
  //       throw new Error('Curso no encontrado');
  //     }

  //     const materia = await manager.findOne(Materias, {
  //       where: { id: dto.idMateria },
  //     });

  //     if (!materia) {
  //       throw new Error('Materia no encontrado');
  //     }

  //     const horario = await manager.findOne(Horarios, {
  //       where: { id: dto.idHorario },
  //     });

  //     if (!horario) {
  //       throw new Error('Horario no encontrado');
  //     }

  //     return {
  //       message: 'Asignacion de curso creado exitosamente',
  //       asignacion: nuevaAsignacion,
  //       docente: docente,
  //       curso: curso,
  //       materia: materia,
  //       horario: horario,
  //     };
  //   });
  // }

  async getHorarioDocente(idPersonal: number): Promise<AsignacionClase[]> {
    return this.asignacionRepository.find({
      where: { personal: { id: idPersonal } },
      relations: ['personal', 'curso', 'materia', 'horario'],
      order: { dia: 'ASC', horario: { horario: 'ASC' } },
    });
  }

  async deleteAsignacion(id: number) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
    });
    if (!asignacion) {
      throw new Error('Asignacion no encontrada');
    }
    asignacion.estado = 'inactivo';
    return await this.asignacionRepository.save(asignacion);
  }

  async getAsignacionesPorCurso(idCurso: number) {
    return this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoin('asignacion.curso', 'curso')
      .leftJoin('asignacion.personal', 'personal')
      .leftJoin('asignacion.materia', 'materia')
      .leftJoin('asignacion.horario', 'horario')
      .where('curso.id = :idCurso', { idCurso })
      .andWhere('asignacion.estado = :estado', { estado: 'activo' })
      .select([
        'asignacion.id AS idAsignacion',
        'asignacion.dia AS dia',

        'horario.id AS idHorario',
        'horario.horario AS horario',

        'personal.id AS idDocente',
        "CONCAT(personal.nombres, ' ', personal.apellidoPat) AS docente",

        'materia.id AS idMateria',
        'materia.nombre AS materia',
      ])
      .orderBy('horario.id', 'ASC')
      .addOrderBy('asignacion.dia', 'ASC')
      .getRawMany();
  }
}
