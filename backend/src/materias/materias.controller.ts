import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { MateriasService } from './materias.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiaService: MateriasService) {}
  @Post('CrearMateria')
  @ApiOperation({ summary: 'Crea una asignatura' })
  async createMateria(@Body() createMateriaDto: CreateMateriaDto) {
    const materia = await this.materiaService.crearMateria(createMateriaDto);

    return {
      message: 'Materia creada correctamente',
      materia,
    };
  }

  @Get('mostrarMaterias')
  @ApiOperation({ summary: 'Lista de materias' })
  listarMaterias() {
    return this.materiaService.listarMaterias();
  }

  @Put('EditarMateria/:id')
  @ApiOperation({ summary: 'Editar Materia' })
  updatePadre(@Param('id') id: number, @Body() dto: CreateMateriaDto) {
    return this.materiaService.updateMateria(id, dto);
  }

  @Delete('EliminarMateria/:id')
  @ApiOperation({ summary: 'Eliminar Materia (lógico)' })
  deleteCurso(@Param('id') id: number) {
    return this.materiaService.deleteMateria(id);
  }
}
