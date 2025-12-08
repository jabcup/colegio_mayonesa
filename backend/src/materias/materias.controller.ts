import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { Materias } from './materias.entity'; 
import { MateriasService } from './materias.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiaService: MateriasService){}
  @Post('CrearMateria')
  @ApiOperation({summary: 'Crea una asignatura'})

  async createMateria(@Body() createMateriaDto: CreateMateriaDto){
    const materia = await this.materiaService.crearMateria(createMateriaDto)

    return {
      message: 'Materia creada correctamente',
      materia,
    }
  }

  @Get('mostrarMaterias')
  @ApiOperation({summary: 'Lista de materias'})
  listarMaterias(){
    return this.materiaService.listarMaterias();
  }
}
