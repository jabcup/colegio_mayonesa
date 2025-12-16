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
import { CreateEstudianteFullDto } from './dto/create-estudiante-full.dto';
import { EstudianteService } from './estudiante.service';
import { LoginEstudianteDto } from './dto/login-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('CrearEstudianteCompleto')
  @ApiOperation({
    summary: 'Crear estudiante, padre (si aplica), asignar curso y pagos',
  })
  async createEstudianteFull(@Body() dto: CreateEstudianteFullDto) {
    return this.estudianteService.createEstudianteFull(dto);
  }

  @Get('MostrarEstudiantes')
  @ApiOperation({ summary: 'Mostrar Estudiantes' })
  listarEstudiantes() {
    return this.estudianteService.mostrarEstudiantes();
  }

  @Get('MostrarEstudiante/:idEstudiante')
  @ApiOperation({ summary: 'Mostrar Estudiante' })
  async mostrarEstudiante(@Param('idEstudiante') id: number) {
    return this.estudianteService.mostrarEstudiante(id);
  }
  @Post('login')
  async login(@Body() loginDto: LoginEstudianteDto) {
    return this.estudianteService.login(
      loginDto.correo_institucional,
      loginDto.rude,
    );
  }

  @Put('editar/:id')
  @ApiOperation({ summary: 'Editar estudiante' })
  update(@Param('id') id: string, @Body() dto: UpdateEstudianteDto) {
    return this.estudianteService.actualizar(+id, dto);
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Eliminar estudiante (lógico)' })
  remove(@Param('id') id: string) {
    return this.estudianteService.eliminar(+id);
  }
}
