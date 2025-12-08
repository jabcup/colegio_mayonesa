import { Body, Get, Post, Controller } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePadreDto } from './dto/create-padre.dto';
import { PadresService } from './padres.service';

@Controller('padres')
export class PadresController {
  constructor(private readonly padresService: PadresService){}
  @Post('CrearPadre')
  @ApiOperation({ summary: 'Crear  Padre' })
  async createPadre(@Body() createPadreDto: CreatePadreDto){
    const padre = await this.padresService.crear(createPadreDto);
    return {
      message: 'Padre creado correctamente',
      padre,
    }
  }

  @Get('MostrarPadres')
  @ApiOperation({ summary: 'Mostrar padres' })
  listarPadres(){
    return this.padresService.todos();
  }
}
