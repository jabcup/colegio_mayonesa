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
import { CreateHorarioDto } from './dto/create-horario.dto';
import { HorariosService } from './horarios.service';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) { }
  @Post('CrearHorario')
  @ApiOperation({ summary: 'Crea un nuevo periodo horario' })
  async createHorario(@Body() createHorarioDto: CreateHorarioDto) {
    const horario = await this.horariosService.crearHorario(createHorarioDto);

    return {
      message: 'Horario creado correctamente',
      horario,
    }
  }

  @Get('mostrarHorarios')
  @ApiOperation({
    summary: 'Muestra los periodos existentes'
  })
  listarHorarios() {
    return this.horariosService.listarHorarios();
  }

  @Put (':id')
  @ApiOperation({ summary: 'Actualizar Horario' })
  update(@Param('id') id: string, @Body() dto: UpdateHorarioDto) {
    return this.horariosService.actualizarHorario(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Horario' })
  eliminarHorario(@Param('id') id: string) {
    return this.horariosService.eliminarHorario(+id);
  }
}
