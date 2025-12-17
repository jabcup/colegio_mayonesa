import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateCorreoUsuarioDto } from './dto/update-correo-usuario.dto';
import { UpdateContrasenaUsuarioDto } from './dto/update-contrasena-usuario.dto';
import { UpdateUsuarioCompletoDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuarios.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}
  @Get('mostrarUsuarios')
  @ApiOperation({ summary: 'Mostrar todos los usuarios' })
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }

  @Put('actualizarUsuario/:id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  updateCorreoUsuario(
    @Param('id') id: number,
    @Body() updateCorreoUsuarioDto: UpdateCorreoUsuarioDto,
  ) {
    return this.usuariosService.updateCorreoUsuario(id, updateCorreoUsuarioDto);
  }

  @Put('actualizarContrasena/:id')
  @ApiOperation({ summary: 'Actualizar la clave de un usuario' })
  updateContrasenaUsuario(
    @Param('id') id: number,
    @Body() updateContrasenaUsuarioDto: UpdateContrasenaUsuarioDto,
  ) {
    return this.usuariosService.updateContrasenaUsuario(
      id,
      updateContrasenaUsuarioDto,
    );
  }

  @Put('actualizarUsuarioCompleto/:id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  updateUsuarioCompleto(
    @Param('id') id: number,
    @Body() updateUsuarioCompletoDto: UpdateUsuarioCompletoDto,
  ) {
    return this.usuariosService.updateUsuarioCompleto(
      id,
      updateUsuarioCompletoDto,
    );
  }

  @Delete('eliminarUsuario/:id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  deleteUsuario(@Param('id') id: number) {
    return this.usuariosService.deleteUsuario(id);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    return this.usuariosService.login(
      loginDto.correo_institucional,
      loginDto.contrasena,
    );
  }
}
