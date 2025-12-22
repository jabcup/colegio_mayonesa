import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { PersonalService } from './personal.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Public()
  @Post('CrearPersonal')
  @ApiOperation({ summary: 'Crear Personal' })
  async createPersonal(@Body() createPersonalDto: CreatePersonalDto) {
    const personal =
      await this.personalService.createPersonal(createPersonalDto);
    return {
      message: 'Personal creado correctamente',
      personal,
    };
  }

  @Post('CrearPersonalCompleto')
  @ApiOperation({ summary: 'Crear Personal Completo' })
  async createPersonalCompleto(@Body() dto: CreatePersonalDto) {
    return this.personalService.crearPersonalCompleto(dto);
  }

  @Get('MostrarPersonal')
  @ApiOperation({ summary: 'Mostrar Personal' })
  listarPersonal() {
    return this.personalService.getPersonal();
  }

  @Get('PersonalActivo')
  @ApiOperation({ summary: 'Mostrar Personal Activo' })
  listarPersonalActivo() {
    return this.personalService.getPersonalActivo();
  }

  @Get('Docentes')
  @ApiOperation({ summary: 'Obtener lista de docentes activos' })
  getDocentes() {
    return this.personalService.getDocentes();
  }

  @Get('DocentesDisponibles')
  @ApiOperation({ summary: 'Docentes disponibles por día y horario' })
  getDocentesDisponibles(
    @Query('dia') dia: string,
    @Query('idHorario') idHorario: number,
    @Query('idAsignacionActual') idAsignacionActual?: number,
  ) {
    return this.personalService.getDocentesDisponibles(
      dia,
      Number(idHorario),
      idAsignacionActual ? Number(idAsignacionActual) : undefined,
    );
  }

  @Put('EditarPersonal/:id')
  @ApiOperation({ summary: 'Editar Personal' })
  updatePersonal(@Param('id') id: number, @Body() dto: Partial<CreatePersonalDto>) {
    return this.personalService.updatePersonal(id, dto);
  }

  @Delete('EliminarPersonal/:id')
  @ApiOperation({ summary: 'Eliminar Personal (lógico)' })
  deletePersonal(@Param('id') id: number) {
    return this.personalService.deletePersonal(id);
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
      const resultado = await this.personalService.verificarCIUnico(
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
