import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEstudianteFullDto } from './dto/create-estudiante-full.dto';
import { EstudianteService } from './estudiante.service';
import { LoginEstudianteDto } from './dto/login-estudiante.dto';

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

  @Post('login')
  async login(@Body() loginDto: LoginEstudianteDto) {
    return this.estudianteService.login(
      loginDto.correo_institucional,
      loginDto.rude,
    );
  }
}
