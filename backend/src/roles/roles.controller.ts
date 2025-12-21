import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolesService } from './roles.service';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
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

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Rol' })
  update(@Param('id') id: string, @Body() dto: UpdateRolDto) {
    return this.rolService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Rol (lógico)' })
  deleteRol(@Param('id') id: number) {
    return this.rolService.deleteRol(id);
  }
}
