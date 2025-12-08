import { Body, Controller, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { LoginUsuarioDto } from './dto/login-usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    return this.usuarioService.login(
      loginDto.correo_institucional,
      loginDto.contrasena,
    );
  }
}
