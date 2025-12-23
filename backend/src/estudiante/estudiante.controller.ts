import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEstudianteFullDto } from './dto/create-estudiante-full.dto';
import { EstudianteService } from './estudiante.service';
import { LoginEstudianteDto } from './dto/login-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Rutas Publicas
import { Public } from 'src/auth/public.decorator';

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
  @Public()
  @Get('MostrarEstudiantes')
  @ApiOperation({ summary: 'Mostrar Estudiantes' })
  listarEstudiantes() {
    return this.estudianteService.mostrarEstudiantes();
  }
  @Public()
  @Get('MostrarEstudiante/:idEstudiante')
  @ApiOperation({ summary: 'Mostrar Estudiante' })
  async mostrarEstudiante(@Param('idEstudiante') id: number) {
    return this.estudianteService.mostrarEstudiante(id);
  }
  @Post('login')
  @Public()
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

      @Get('verificar-ci-unico')
    async verificarCIUnico(
      @Query('ciNumero') ciNumero: string,
      @Query('idExcluir', new ParseIntPipe({ optional: true })) idExcluir?: number,
    ) {
      try {
        // Validar que se proporcione el número de CI
        if (!ciNumero || ciNumero.trim() === '') {
          throw new HttpException(
            'El número de CI es requerido',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        // Validar que el CI contenga solo números
        if (!/^\d+$/.test(ciNumero)) {
          throw new HttpException(
            'El número de CI debe contener solo dígitos',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        // Verificar la unicidad del CI
        const resultado = await this.estudianteService.verificarCIUnico(
          ciNumero,
          idExcluir,
        );
  
        return {
          success: true,
          ...resultado,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
  
        console.error('Error en verificar-ci-unico:', error);
        throw new HttpException(
          {
            success: false,
            message: 'Error interno al verificar el CI',
            error: error,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
