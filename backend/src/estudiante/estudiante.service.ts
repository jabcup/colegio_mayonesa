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
      // Validar que el CI no esté repetido
      const ciExistente = await manager.findOne(Estudiante, {
        where: { identificacion: dto.identificacion },
      });

      if (ciExistente) {
        throw new BadRequestException('Ya existe un estudiante con este número de CI');
      }

      // Generar correo institucional: primerNombre.ci@colegio.edu.bo
      const primerNombre = dto.nombres.trim().split(' ')[0].toLowerCase();
const correoInstitucional = `${primerNombre.toLocaleLowerCase()}.${dto.identificacion.split(' ')[0]}@colegio.edu.bo`;

      // Cambia el dominio si es diferente (ej: @unidadeducativa.edu.bo)
      const dominio = 'colegio.edu.bo'; // ← Puedes mover esto a .env si quieres

      const estudiante = manager.create(Estudiante, {
        nombres: dto.nombres,
        apellidoPat: dto.apellidoPat,
        apellidoMat: dto.apellidoMat, // nullable
        identificacion: dto.identificacion,
        correo: dto.correo,
        correo_institucional: `${primerNombre}.${dto.identificacion}@${dominio}`,

        rude: `R${dto.identificacion}${dto.nombres.charAt(0).toUpperCase()}${dto.apellidoPat.charAt(0).toUpperCase()}${(
          dto.apellidoMat || ''
        )
          .charAt(0)
          .toUpperCase()}`,

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
      const curso = await manager.findOne(Curso, {
        where: { id: dto.idCurso },
      });
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
    if (!estudiante)
      throw new UnauthorizedException('Credenciales incorrectas');
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

  async actualizar(id: number, dto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Validar CI único si se está cambiando
    if (dto.identificacion && dto.identificacion !== estudiante.identificacion) {
      const ciExistente = await this.estudianteRepository.findOne({
        where: { identificacion: dto.identificacion },
      });

      if (ciExistente) {
        throw new BadRequestException('Ya existe otro estudiante con este número de CI');
      }
    }

    // Aplicar los cambios del DTO
    Object.assign(estudiante, dto);

    // Regenerar correo institucional si cambian nombre o CI
    if (dto.nombres || dto.identificacion) {
      const primerNombre = (dto.nombres || estudiante.nombres).trim().split(' ')[0].toLowerCase();
      const ci = dto.identificacion || estudiante.identificacion;
      const dominio = 'colegio.edu.bo'; // ← Cambia si es necesario
      estudiante.correo_institucional = `${primerNombre}.${ci}@${dominio}`;
    }

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

   async verificarCIUnico(
    ciNumero: string,
    idExcluir?: number,
  ): Promise<{ esUnico: boolean; mensaje: string }> {
    try {
      // Normalizar el número de CI (eliminar espacios y convertir a string)
      const ciNormalizado = ciNumero.trim();
      
      if (!ciNormalizado) {
        return {
          esUnico: true,
          mensaje: 'CI no proporcionado',
        };
      }

      // Buscar registros donde el identificacion comience con el número de CI
      // Esto cubre casos como "1234567 LP", "1234567 SC", etc.
      const queryBuilder = this.estudianteRepository
        .createQueryBuilder('estudiante')
        .where('estudiante.identificacion LIKE :ciConEspacio', {
          ciConEspacio: `${ciNormalizado} %`,
        })
        .orWhere('estudiante.identificacion = :ciExacto', {
          ciExacto: ciNormalizado,
        })
        .andWhere('estudiante.estado = :estado', { estado: 'activo' });

      // Excluir el registro actual en caso de edición
      if (idExcluir) {
        queryBuilder.andWhere('estudiante.id != :idExcluir', {
          idExcluir: idExcluir,
        });
      }

      const estudianteExistente = await queryBuilder.getOne();

      if (estudianteExistente) {
        return {
          esUnico: false,
          mensaje: `El número de CI ${ciNormalizado} ya está registrado ${
            estudianteExistente.identificacion.includes(' ')
              ? `con extensión ${estudianteExistente.identificacion.split(' ')[1]}`
              : ''
          } para ${estudianteExistente.nombres} ${estudianteExistente.apellidoPat}`,
        };
      }

      return {
        esUnico: true,
        mensaje: 'CI disponible',
      };
    } catch (error) {
      console.error('Error en verificarCIUnico:', error);
      throw new Error(
        'Error al verificar la unicidad del CI. Por favor, intente nuevamente.',
      );
    }
  }
}