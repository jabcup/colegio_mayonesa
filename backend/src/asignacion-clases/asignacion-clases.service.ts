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
    const conflicto = await this.existeConflictoDocente(
      dtoAsignacion.idPersonal,
      dtoAsignacion.dia,
      dtoAsignacion.idHorario,
    );

    if (conflicto) {
      throw new Error('El docente ya tiene una clase en ese horario');
    }

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
      .leftJoin('curso.paralelo', 'paralelo')
      .where('personal.id = :idDocente', { idDocente })
      .select([
        'curso.id AS id',
        'curso.nombre AS nombre',
        'paralelo.nombre AS paralelo',
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

  async getMateriasPorDocenteYCursoAsignacion(
    idDocente: number,
    idCurso: number,
  ) {
    return this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoin('asignacion.materia', 'materia')
      .leftJoin('asignacion.personal', 'personal')
      .leftJoin('asignacion.curso', 'curso')
      .where('personal.id = :idDocente', { idDocente })
      .andWhere('curso.id = :idCurso', { idCurso })
      .select([
        'asignacion.id AS idAsignacion', // 🔑 CLAVE
        'materia.id AS idMateria',
        'materia.nombre AS nombre',
      ])
      .getRawMany();
  }

  async getAsignacionesPorEstudiante(idEstudiante: number) {
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
        personal: { nombres: true, apellidoPat: true, apellidoMat: true },
        horario: { horario: true },
      },
      where: { curso: { id: idCurso } },
      relations: ['materia', 'horario', 'personal'], //Si se desea tener datos del docente se debe agregar personal al relation
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

      asignacion.dia = dto.dia ?? asignacion.dia;

      if (dto.idPersonal) {
        asignacion.personal = { id: dto.idPersonal } as any;
      }

      if (dto.idCurso) {
        asignacion.curso = { id: dto.idCurso } as any;
      }

      if (dto.idMateria) {
        asignacion.materia = { id: dto.idMateria } as any;
      }

      if (dto.idHorario) {
        asignacion.horario = { id: dto.idHorario } as any;
      }

      return await manager.save(asignacion);
    });
  }

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

  async existeConflictoDocente(
    idDocente: number,
    dia: string,
    idHorario: number,
  ) {
    return this.asignacionRepository
      .createQueryBuilder('asignacion')
      .where('asignacion.idPersonal = :idDocente', { idDocente })
      .andWhere('asignacion.dia = :dia', { dia })
      .andWhere('asignacion.idHorario = :idHorario', { idHorario })
      .andWhere('asignacion.estado = :estado', { estado: 'activo' })
      .getCount();
  }
}
