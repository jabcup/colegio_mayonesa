import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
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

  @Get('CursosActivos')
  @ApiOperation({ summary: 'Mostrar Cursos Activos' })
  listarCursosActivos() {
    return this.cursosService.getCursosActivos();
  }

  @Put('EditarCurso/:id')
  @ApiOperation({ summary: 'Editar Curso' })
  updateCurso(@Param('id') id: number, @Body() dto: CreateCursoDto) {
    return this.cursosService.updateCurso(id, dto);
  }

  @Delete('EliminarCurso/:id')
  @ApiOperation({ summary: 'Eliminar Curso (lógico)' })
  deleteCurso(@Param('id') id: number) {
    return this.cursosService.deleteCurso(id);
  }
}
