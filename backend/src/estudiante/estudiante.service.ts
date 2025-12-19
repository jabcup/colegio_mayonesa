import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      // 1. CREAR ESTUDIANTE
      const estudiante = manager.create(Estudiante, {
        nombres: dto.nombres,
        apellidoPat: dto.apellidoPat,
        apellidoMat: dto.apellidoMat, // nullable
        identificacion: dto.identificacion,
        correo: dto.correo,
        correo_institucional: `${
          dto.nombres.toLowerCase().split(' ')[0]
        }.${dto.apellidoPat.toLowerCase()}@mayonesa.estudiante.edu.bo`,
        rude: `R${dto.identificacion}${dto.nombres.charAt(0).toUpperCase()}${dto.apellidoPat.charAt(0).toUpperCase()}${(
          dto.apellidoMat || ''
        ).charAt(0).toUpperCase()}`,
        direccion: dto.direccion,
        telefono_referencia: dto.telefono_referencia,
        fecha_nacimiento: dto.fecha_nacimiento,
        sexo: dto.sexo,
        nacionalidad: dto.nacionalidad,
      });

      const nuevoEstudiante = await manager.save(estudiante);

      // 2. OBTENER O CREAR PADRE
      let padre;
      if (dto.idPadre) {
        padre = await manager.findOne(Padres, { where: { id: dto.idPadre } });
        if (!padre) throw new NotFoundException('Padre no encontrado');
      } else {
        padre = await manager.save(
          manager.create(Padres, {
            nombres: dto.padreData.nombres,
            apellidoPat: dto.padreData.apellidoPat,
            apellidoMat: dto.padreData.apellidoMat,
            telefono: dto.padreData.telefono,
            correo: dto.padreData.correo,
          }),
        );
      }

      // 3. ASIGNAR PADRE AL ESTUDIANTE
      await manager.save(
        manager.create(EstudianteTutor, {
          estudiante: nuevoEstudiante,
          tutor: padre,
          relacion: dto.relacion,
        }),
      );

      // 4. ASIGNAR CURSO
      const curso = await manager.findOne(Curso, { where: { id: dto.idCurso } });
      if (!curso) throw new NotFoundException('Curso no encontrado');
      await manager.save(
        manager.create(EstudianteCurso, {
          estudiante: nuevoEstudiante,
          curso: curso,
        }),
      );

      // 5. GENERAR PAGOS (10 mensualidades)
      const pagosGenerados: Pagos[] = [];
      const anioActual = new Date().getFullYear();
      for (let i = 1; i <= 10; i++) {
        const pago = manager.create(Pagos, {
          estudiante: nuevoEstudiante,
          cantidad: 800,
          descuento: 0,
          total: 800,
          concepto: `Mensualidad ${i}/10`,
          deuda: 'pendiente',
          anio: anioActual,
          mes: i as any,
          tipo: 'mensual',
        });
        pagosGenerados.push(await manager.save(pago));
      }

      return {
        message: 'Estudiante creado exitosamente',
        estudiante: nuevoEstudiante,
        padre,
        curso,
        pagos: pagosGenerados,
      };
    });
  }

  async mostrarEstudiantes(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }

  async mostrarEstudiante(id: number): Promise<Estudiante> {
    return this.estudianteRepository.findOne({ where: { id } });
  }

  async login(correo_institucional: string, rude: string) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { correo_institucional },
    });
    if (!estudiante) throw new UnauthorizedException('Credenciales incorrectas');
    if (estudiante.estado === 'inactivo')
      throw new UnauthorizedException('Cuenta inactiva');
    if (estudiante.rude !== rude)
      throw new UnauthorizedException('Credenciales incorrectas');
    return {
      message: 'Inicio de sesión exitoso',
      estudiante: {
        id: estudiante.id,
        correo: estudiante.correo_institucional,
      },
    };
  }
}
