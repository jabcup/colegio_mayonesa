import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PadreEstudianteService } from './padre-estudiante.service';
import { CreatePadreEstudianteDto } from './dto/create-padre-estudiante.dto';
import { EstudianteTutor } from './padreEstudiante.entity';

@Controller('padre-estudiante')
export class PadreEstudianteController {
  constructor(
    private readonly padreEstudianteService: PadreEstudianteService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Obtener todos los Padres-Estudiantes' })
  listarPadresEstudiantes() {
    return this.padreEstudianteService.listarPadresEstudiantes();
  }

  @Get('Activos')
  @ApiOperation({ summary: 'Obtener todos los Padres-Estudiantes Activos' })
  listarPadresEstudiantesActivos() {
    return this.padreEstudianteService.listarPadresEstudiantesActivos();
  }

  @Get(':idEstudiante/todos')
  @ApiOperation({
    summary: 'Obtener un estudiante con todos sus padres',
  })
  listarTodosPadreEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.padreEstudianteService.listarTodosPadreEstudianteEspecifico(
      idEstudiante,
    );
  }

  @Get(':idEstudiante/ultimo')
  @ApiOperation({
    summary: 'Obtener un estudiante con el ultimo padre',
  })
  listarUltimoPadreEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.padreEstudianteService.listarUltimoPadreEstudianteEspecifico(
      idEstudiante,
    );
  }
  @Post('AsignarPadreEstudiante')
  @ApiOperation({ summary: 'Asignar a un estudiante un padre' })
  async asignarEstudiante(
    @Body() createPadreEstudianteDto: CreatePadreEstudianteDto,
  ) {
    const padreEstudiante: EstudianteTutor =
      await this.padreEstudianteService.asignarEstudiante(
        createPadreEstudianteDto,
      );
    return {
      message: 'Asignacion creada correctamente',
      padreEstudiante,
    };
  }
}
