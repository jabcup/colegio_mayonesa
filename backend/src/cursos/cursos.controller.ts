import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCursoDto } from './dto/create-curso.dto';
import { CursosService } from './cursos.service';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}
  @Post('CrearCurso')
  @ApiOperation({ summary: 'Crear Curso' })
  async createCurso(@Body() createCursoDto: CreateCursoDto) {
    const curso = await this.cursosService.createCurso(createCursoDto);
    return {
      message: 'Curso creado correctamente',
      curso,
    };
  }
  @Get('MostrarCursos')
  @ApiOperation({ summary: 'Mostrar Cursos' })
  listarCursos() {
    return this.cursosService.getCursos();
  }
}
