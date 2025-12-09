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
import { CreatePadreDto } from './dto/create-padre.dto';
import { PadresService } from './padres.service';
import { UpdatePadreDto } from './dto/update-padre.dto';

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

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar padre' })
  updatePadre(@Param('id') id: string, @Body() dto: UpdatePadreDto) {
    return this.padresService.actualizar(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar padre' })
  eliminarPadre(@Param('id') id: string) {
    return this.padresService.eliminar(+id);
  }
}
