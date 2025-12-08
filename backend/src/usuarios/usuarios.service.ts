import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuarios.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
  ) {}

  async login(correo_institucional: string, contrasena: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_institucional },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
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
