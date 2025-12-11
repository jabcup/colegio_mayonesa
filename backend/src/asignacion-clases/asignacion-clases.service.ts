import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { Repository } from 'typeorm';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
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

  // async createAsignacionFull(dto: CreateAsignacionFulDto) {
  //   return this.dataSource.transaction(async (manager) => {
  //     const asignacion = manager.create(AsignacionClase, {
  //       dia: dto.dia,
  //     });

  //     const nuevaAsignacion = await manager.save(asignacion);

  //     const docente = await manager.findOne(Personal, {
  //       where: { id: dto.idPersonal },
  //     });

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
  
}
