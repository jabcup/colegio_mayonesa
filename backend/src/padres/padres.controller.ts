import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePadreDto } from './dto/create-padre.dto';
import { PadresService } from './padres.service';
import { UpdatePadreDto } from './dto/update-padre.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('padres')
export class PadresController {
  constructor(private readonly padresService: PadresService) {}
  @Post('CrearPadre')
  @ApiOperation({ summary: 'Crear  Padre' })
  async createPadre(@Body() createPadreDto: CreatePadreDto) {
    const padre = await this.padresService.crear(createPadreDto);
    return {
      message: 'Padre creado correctamente',
      padre,
    };
  }

  @Get('MostrarPadres')
  @ApiOperation({ summary: 'Mostrar padres' })
  listarPadres() {
    return this.padresService.todos();
  }

  @Put('editar/:id')
  @ApiOperation({ summary: 'Actualizar padre' })
  updatePadre(@Param('id') id: string, @Body() dto: UpdatePadreDto) {
    return this.padresService.actualizar(+id, dto);
  }

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Eliminar padre (lógico)' })
  eliminarPadre(@Param('id') id: string) {
    return this.padresService.eliminar(+id);
  }
}
