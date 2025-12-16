import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PadreEstudianteService } from './padre-estudiante.service';
import { CreatePadreEstudianteDto } from './dto/create-padre-estudiante.dto';
import { EstudianteTutor } from './padreEstudiante.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('padre-estudiante')
export class PadreEstudianteController {
  constructor(
    private readonly padreEstudianteService: PadreEstudianteService,
  ) {}
  @Get('todos')
  @ApiOperation({ summary: 'Obtener todos los Padres-Estudiantes' })
  listarPadresEstudiantes() {
    return this.padreEstudianteService.listarEstudiantesPadres();
  }

  @Get('Activos')
  @ApiOperation({ summary: 'Obtener todos los Padres-Estudiantes Activos' })
  listarPadresEstudiantesActivos() {
    return this.padreEstudianteService.listarEstudiantePadresActivos();
  }

  @Get(':idEstudiante/todos')
  @ApiOperation({
    summary: 'Obtener un estudiante con todos sus padres',
  })
  listarTodosPadreEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.padreEstudianteService.listarTodosEstudiantePadresEspecifico(
      idEstudiante,
    );
  }

  @Get(':idEstudiante/ultimo')
  @ApiOperation({
    summary: 'Obtener un estudiante con el ultimo padre',
  })
  listarUltimoPadreEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.padreEstudianteService.listarUltimoEstudiantePadreEspecifico(
      idEstudiante,
    );
  }

  @Get(':idPadre')
  @ApiOperation({
    summary: 'Obtener un padre con todos sus estudiantes',
  })
  listarPadreEstudiantes(@Param('idPadre') idPadre: number) {
    return this.padreEstudianteService.listarPadreEstudiantes(idPadre);
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
