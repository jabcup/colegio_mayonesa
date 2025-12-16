import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AvisosService } from './avisos.service';
import { CreateAvisosDto } from './dto/create-avisos.dto';
import { UpdateAvisosDto } from './dto/update-avisos.dto';
import { Curso } from '../cursos/cursos.entity';

@Controller('avisos')
export class AvisosController {
  constructor(private readonly avisosService: AvisosService) {}

  @Post('CrearAviso')
  @ApiOperation({ summary: 'Crea un nuevo aviso' })
  async createAviso(@Body() createAvisosDto: CreateAvisosDto) {
    const aviso = await this.avisosService.crearAviso(createAvisosDto);
    return {
      message: 'Aviso enviado correctamente',
      aviso,
    };
  }

  @Get('Curso/:cursoId')
  @ApiOperation({ summary: 'Obtener Avisos por Curso' })
  async obtenerAvisosPorCurso(@Param('cursoId') cursoId: number) {
    const curso = new Curso();
    curso.id = cursoId;
    return this.avisosService.obtenerAvisosPorCurso(curso);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Aviso' })
  update(@Param('id') id: string, @Body() dto: UpdateAvisosDto) {
    return this.avisosService.actualizarAviso(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Aviso (cambia estado a inactivo)' })
  eliminarAviso(@Param('id') id: string) {
    return this.avisosService.eliminarAviso(+id);
  }
}