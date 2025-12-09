import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Usuarios } from './usuarios.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCorreoUsuarioDto } from './dto/update-correo-usuario.dto';
import { UpdateContrasenaUsuarioDto } from './dto/update-contrasena-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioCompletoDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
  ) {}
  async listarUsuarios(): Promise<Usuarios[]> {
    return this.usuariosRepository.find({
      select: {
        id: true,
        correo_institucional: true,
        personal: {
          nombres: true,
          apellidoPat: true,
          apellidoMat: true,
          correo: true,
        },
        rol: {
          nombre: true,
        },
        fecha_creacion: true,
        estado: true,
        // No incluyas la contraseña
      },
      relations: ['personal', 'rol'],
    });
  }

  async updateCorreoUsuario(
    id: number,
    dtoUsuarioCorreo: UpdateCorreoUsuarioDto,
  ): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    Object.assign(usuario, dtoUsuarioCorreo);
    return this.usuariosRepository.save(usuario);
  }

  async updateContrasenaUsuario(
    id: number,
    dtoUsuarioContrasena: UpdateContrasenaUsuarioDto,
  ): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const passHash = (await bcrypt.hash(
      dtoUsuarioContrasena.contrasena,
      10,
    )) as string;
    dtoUsuarioContrasena.contrasena = passHash;

    Object.assign(usuario, dtoUsuarioContrasena);

    return this.usuariosRepository.save(usuario);
  }

  async updateUsuarioCompleto(
    id: number,
    dtoUsuarioCompleto: UpdateUsuarioCompletoDto,
  ): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const passHash = (await bcrypt.hash(
      dtoUsuarioCompleto.contrasena,
      10,
    )) as string;
    dtoUsuarioCompleto.contrasena = passHash;

    Object.assign(usuario, dtoUsuarioCompleto);
    return this.usuariosRepository.save(usuario);
  }
  async deleteUsuario(id: number): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    usuario.estado = 'inactivo';
    return this.usuariosRepository.save(usuario);
  }

  async login(correo_institucional: string, contrasena: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { correo_institucional },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if(usuario.estado === 'inactivo') {
      throw new UnauthorizedException('Cuenta inactiva');
    }
    const passValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passValido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return {
      message: 'Inicio de sesión exitoso',
      usuario: { id: usuario.id, correo: usuario.correo_institucional },
    };
  }
}
