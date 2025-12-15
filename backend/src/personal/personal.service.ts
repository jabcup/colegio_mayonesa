import { Injectable } from '@nestjs/common';
import { Personal } from './personal.entity';
import { Usuarios } from '../usuarios/usuarios.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { CreatePersonalFullDto } from './dto/create-personal-full.dto';
import { Roles } from 'src/roles/roles.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
    @InjectRepository(Roles)
    private readonly rolRepository: Repository<Roles>,

    private dataSource: DataSource,
  ) {}

  async createPersonal(dtoPersonal: CreatePersonalDto): Promise<Personal> {
    const personal = this.personalRepository.create(dtoPersonal);
    return this.personalRepository.save(personal);
  }

  async getPersonal(): Promise<Personal[]> {
    return this.personalRepository.find();
  }

  async getPersonalActivo(): Promise<Personal[]> {
    return this.personalRepository.find({ where: { estado: 'activo' } });
  }

  async getDocentes() {
    return this.personalRepository
      .createQueryBuilder('personal')
      .innerJoin('usuarios', 'usuario', 'usuario.idPersonal = personal.id')
      .innerJoin('roles', 'rol', 'rol.id = usuario.idRol')
      .where('rol.nombre = :rol', { rol: 'Docente' })
      .andWhere('personal.estado = :estado', { estado: 'activo' })
      .andWhere('usuario.estado = :estadoUsuario', { estadoUsuario: 'activo' })
      .select([
        'personal.id AS id',
        "CONCAT(personal.nombres, ' ', personal.apellidoPat) AS nombre",
        'personal.correo AS correo',
      ])
      .orderBy('personal.apellidoPat', 'ASC')
      .getRawMany();
  }

  async updatePersonal(
    id: number,
    dtoPersonal: CreatePersonalDto,
  ): Promise<Personal> {
    const personal = await this.personalRepository.findOne({ where: { id } });

    if (!personal) {
      throw new Error('Personal no encontrado');
    }

    // Mezcla los datos nuevos con los actuales
    Object.assign(personal, dtoPersonal);

    return this.personalRepository.save(personal);
  }

  async deletePersonal(id: number): Promise<Personal> {
    const personal = await this.personalRepository.findOne({ where: { id } });
    if (!personal) {
      throw new Error('Personal no encontrado');
    }
    personal.estado = 'inactivo';
    return this.personalRepository.save(personal);
  }

  async crearPersonalCompleto(dto: CreatePersonalFullDto) {
    return this.dataSource.transaction(async (manager) => {
      // const personal = manager.create(Personal, dto);

      const personal = manager.create(Personal, {
        nombres: dto.nombres,
        apellidoPat: dto.apellidoPat,
        apellidoMat: dto.apellidoMat,
        telefono: dto.telefono,
        identificacion: dto.identificacion,
        direccion: dto.direccion,
        correo: dto.correo,
        fecha_nacimiento: dto.fecha_nacimiento,
      });

      const nuevoPersonal = await manager.save(personal);

      const rol = await manager.findOne(Roles, {
        where: { id: dto.idRol },
      });

      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      const hashPass = await bcrypt.hash(dto.identificacion, 10);

      const usuario = manager.create(Usuarios, {
        correo_institucional: `${nuevoPersonal.nombres.toLowerCase()}.${nuevoPersonal.apellidoPat.toLowerCase()}@mayonesa.com`,
        contrasena: hashPass,
        rol,
        personal: nuevoPersonal,
      });

      await manager.save(usuario);

      return {
        message: 'Personal creado correctamente',
        personal: nuevoPersonal,
        usuario: usuario,
        rol: rol,
      };
    });
  }
}
