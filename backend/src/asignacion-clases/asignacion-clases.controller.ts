import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AsignacionClasesService } from './asignacion-clases.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';

@Controller('asignacion-clases')
export class AsignacionClasesController {
  constructor(private readonly asignacionService: AsignacionClasesService) {}
  @Post('CrearAsignacion')
  @ApiOperation({ summary: 'Crear Asignacion' })
  // async createAsignacion(
  //   @Body() CreateAsignacionFullDto: CreateAsignacionFulDto,
  // ) {
  //   const asignacion = await this.asignacionService.createAsignacionFull(
  //     CreateAsignacionFullDto,
  //   );
  //   return {
  //     message: 'Asignacion creada exitosamente',
  //     asignacion,
  //   };
  // }
  @Post('CrearAsignacion')
  @ApiOperation({ summary: 'Crear Asignacion' })
  async createAsignacion(
    @Body() CreateAsignacionFullDto: CreateAsignacionFulDto,
  ) {
    const asignacion = await this.asignacionService.createAsignacionFull(
      CreateAsignacionFullDto,
    );
    return {
      message: 'Asignacion creada exitosamente',
      asignacion,
    };
  }

  @Get('horario/:idPersonal')
  async getHorarioDocente(@Param('idPersonal', ParseIntPipe) idPersonal: number) {
    return this.asignacionService.getHorarioDocente(idPersonal);
  }
  
}
