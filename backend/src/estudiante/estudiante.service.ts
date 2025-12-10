import { Injectable } from '@nestjs/common';
import { Estudiante } from './estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateEstudianteFullDto } from './dto/create-estudiante-full.dto';
import { Padres } from '../padres/padres.entity';
import { EstudianteTutor } from '../padre-estudiante/padreEstudiante.entity';
import { Curso } from '../cursos/cursos.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';
import { Pagos } from 'src/pagos/pagos.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Padres)
    private readonly padreRepository: Repository<Padres>,
    @InjectRepository(EstudianteTutor)
    private readonly estudianteTutorRepository: Repository<EstudianteTutor>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>,
    @InjectRepository(Pagos)
    private readonly pagosRepository: Repository<Pagos>,
    private dataSource: DataSource,
  ) {}

  async createEstudianteFull(dto: CreateEstudianteFullDto) {
    return this.dataSource.transaction(async (manager) => {
      // Crear el estudiante
      const estudiante = manager.create(Estudiante, {
        nombres: dto.nombres,
        apellidoPat: dto.apellidoPat,
        apellidoMat: dto.apellidoMat,
        identificacion: dto.identificacion,
        correo: dto.correo,
        correo_institucional: `${dto.nombres.toLowerCase().split(' ')[0]}.${dto.apellidoPat.toLowerCase()}@mayonesa.estudiante.edu.bo`,
        rude: `R${dto.identificacion}${dto.nombres.charAt(0).toUpperCase()}${dto.apellidoPat.charAt(0).toUpperCase()}${dto.apellidoMat.charAt(0).toUpperCase()}`,
        direccion: dto.direccion,
        telefono_referencia: dto.telefono_referencia,
        fecha_nacimiento: dto.fecha_nacimiento,
        sexo: dto.sexo,
        nacionalidad: dto.nacionalidad,
      });

      const nuevoEstudiante = await manager.save(estudiante);

      const padre = await manager.findOne(Padres, {
        where: { id: dto.idPadre },
      });

      if (!padre) {
        throw new Error('Padre no encontrado');
      }

      const estudianteTutor = manager.create(EstudianteTutor, {
        estudiante: nuevoEstudiante,
        tutor: padre,
        relacion: dto.relacion,
      });

      await manager.save(estudianteTutor);

      const curso = await manager.findOne(Curso, {
        where: { id: dto.idCurso },
      });

      if (!curso) {
        throw new Error('Curso no encontrado');
      }

      const estudianteCurso = manager.create(EstudianteCurso, {
        estudiante: nuevoEstudiante,
        curso: curso,
      });

      await manager.save(estudianteCurso);

      const pagosGenerados = [];

      for (let i = 1; i <= 10; i++) {
        const pago = manager.create(Pagos, {
          estudiante: nuevoEstudiante,
          cantidad: 800,
          descuento: 0,
          total: 800,
          numero_pago: i, // 1 al 10
        });

        const pagoGuardado = await manager.save(pago);

        pagosGenerados.push(pagoGuardado);
      }

      return {
        message: 'Estudiante creado exitosamente',
        estudiante: nuevoEstudiante,
        padre: padre,
        curso: curso,
        pagos: pagosGenerados,
      };
    });
  }

  async mostrarEstudiantes(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }

}
