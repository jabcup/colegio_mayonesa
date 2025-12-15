import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { PersonalService } from './personal.service';
import { CreatePersonalFullDto } from './dto/create-personal-full.dto';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

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
  async createPersonalCompleto(@Body() dto: CreatePersonalFullDto) {
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
  updatePersonal(@Param('id') id: number, @Body() dto: CreatePersonalDto) {
    return this.personalService.updatePersonal(id, dto);
  }

  @Delete('EliminarPersonal/:id')
  @ApiOperation({ summary: 'Eliminar Personal (lógico)' })
  deletePersonal(@Param('id') id: number) {
    return this.personalService.deletePersonal(id);
  }
}
