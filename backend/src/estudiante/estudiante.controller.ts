import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEstudianteFullDto } from './dto/create-estudiante-full.dto';
import { EstudianteService } from './estudiante.service';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('CrearEstudianteCompleto')
  @ApiOperation({ summary: 'Crear Estudiante Completo' })
  async createEstudiante(
    @Body() CreateEstudianteFullDto: CreateEstudianteFullDto,
  ) {
    const estudiante = await this.estudianteService.createEstudianteFull(
      CreateEstudianteFullDto,
    );
    return {
      message: 'Estudiante creado exitosamente',
      estudiante,
    };
  }

}
