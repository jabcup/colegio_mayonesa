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
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

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
      if (dto.idPadre && dto.padreData) {
        throw new BadRequestException(
          'Envía solo idPadre o padreData, no ambos',
        );
      }

      if (!dto.idPadre && !dto.padreData) {
        throw new BadRequestException('Debe enviar idPadre o padreData');
      }
      const existe = await manager.findOne(Estudiante, {
        where: { identificacion: dto.identificacion },
      });

      if (existe) {
        throw new BadRequestException(
          'Ya existe un estudiante con esa identificación',
        );
      }

      const estudiante = manager.create(Estudiante, {
        nombres: dto.nombres,
        apellidoPat: dto.apellidoPat,
        apellidoMat: dto.apellidoMat,
        identificacion: dto.identificacion,
        correo: dto.correo,
        correo_institucional: `${
          dto.nombres.toLowerCase().split(' ')[0]
        }.${dto.apellidoPat.toLowerCase()}@mayonesa.estudiante.edu.bo`,
        rude: `R${dto.identificacion}${dto.nombres[0]}${dto.apellidoPat[0]}${dto.apellidoMat[0]}`,
        direccion: dto.direccion,
        telefono_referencia: dto.telefono_referencia,
        fecha_nacimiento: dto.fecha_nacimiento,
        sexo: dto.sexo,
        nacionalidad: dto.nacionalidad,
      });

      const nuevoEstudiante = await manager.save(estudiante);

      let padre: Padres;

      if (dto.idPadre) {
        padre = await manager.findOne(Padres, {
          where: { id: dto.idPadre },
        });

        if (!padre) {
          throw new NotFoundException('Padre no encontrado');
        }
      } else {
        padre = await manager.save(manager.create(Padres, dto.padreData));
      }

      await manager.save(
        manager.create(EstudianteTutor, {
          estudiante: nuevoEstudiante,
          tutor: padre,
          relacion: dto.relacion,
        }),
      );

      const curso = await manager.findOne(Curso, {
        where: { id: dto.idCurso },
      });

      if (!curso) {
        throw new NotFoundException('Curso no encontrado');
      }

      await manager.save(
        manager.create(EstudianteCurso, {
          estudiante: nuevoEstudiante,
          curso,
        }),
      );

      const pagos = [];

      for (let i = 1; i <= 10; i++) {
        pagos.push(
          await manager.save(
            manager.create(Pagos, {
              estudiante: nuevoEstudiante,
              cantidad: 800,
              descuento: 0,
              concepto: 'Mensualidad',
              total: 800,
              numero_pago: i,
            }),
          ),
        );
      }

      return {
        message: 'Estudiante creado correctamente',
        estudiante: nuevoEstudiante,
        padre,
        curso,
        pagos,
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
    if (!estudiante) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (estudiante.estado === 'inactivo') {
      throw new UnauthorizedException('Cuenta inactiva');
    }
    if (estudiante.rude !== rude) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return {
      message: 'Inicio de sesión exitoso',
      estudiante: {
        id: estudiante.id,
        correo: estudiante.correo_institucional,
      },
    };
  }

  async actualizar(id: number, dto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    Object.assign(estudiante, dto);
    return this.estudianteRepository.save(estudiante);
  }

  async eliminar(id: number): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    estudiante.estado = 'inactivo';
    await this.estudianteRepository.save(estudiante);
  }
}
