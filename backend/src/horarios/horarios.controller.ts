import { Body, Get, Post, Controller } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor (private readonly horariosService: HorariosService){}
    @Post('CrearHorario')
    @ApiOperation({summary: 'Crea un nuevo periodo horario'})
    async createHorario(@Body() createHorarioDto: CreateHorarioDto){
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
  listarHorarios(){
    return this.horariosService.listarHorarios();
  }
}
