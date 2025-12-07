import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolService: RolesService) {}
  @Post('CrearRol')
  @ApiOperation({ summary: 'Crear Rol' })
  async createRol(@Body() createRolDto: CreateRolDto) {
    const rol = await this.rolService.createRol(createRolDto);
    return {
      message: 'Rol creado correctamente',
      rol,
    };
  }

  @Get('MostrarRoles')
  @ApiOperation({ summary: 'Mostrar Roles' })
  listarRoles() {
    return this.rolService.getRoles();
  }
}
