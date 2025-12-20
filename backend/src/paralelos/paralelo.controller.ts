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
import { CreateParaleloDto } from './dto/create-paralelo.dto';
import { ParalelosService } from './paralelo.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('paralelos')
export class ParaleloController {
  constructor(private readonly paraleloService: ParalelosService) {}
  @Post('CrearParalelo')
  @ApiOperation({ summary: 'Crear Paralelo' })
  async createParalelo(@Body() createParaleloDto: CreateParaleloDto) {
    const paralelo =
      await this.paraleloService.createParalelo(createParaleloDto);
    return {
      message: 'Rol creado correctamente',
      paralelo,
    };
  }

  @Get('MostrarParalelos')
  @ApiOperation({ summary: 'Mostrar Paralelos' })
  listarParalelos() {
    return this.paraleloService.getParalelos();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Paralelo' })
  update(@Param('id') id: string, @Body() dto: CreateParaleloDto) {
    return this.paraleloService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Paralelo (lógico)' })
  deleteParalelo(@Param('id') id: number) {
    return this.paraleloService.deleteParalelo(id);
  }
}
