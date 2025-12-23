import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTutoresDto } from './dto/create-tutores.dto';
import { TutoresService } from './tutores.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tutores')
export class TutoresController {
  constructor(private readonly tutoresService: TutoresService) {}

  @Post('CrearTutor')
  @ApiOperation({ summary: 'Crear Tutor' })
  async createTutores(@Body() dto: CreateTutoresDto) {
    const tutor = await this.tutoresService.createTutores(dto);
    return {
      message: 'Tutor creado correctamente',
      tutor,
    };
  }

  @Get('ListarTutores')
  @ApiOperation({ summary: 'Listar Tutores' })
  async getTutores() {
    const tutores = await this.tutoresService.getTutores();
    return {
      message: 'Lista de tutores',
      tutores,
    };
  }

  @Put('EditarTutor/:id')
  @ApiOperation({ summary: 'Editar asignación de tutor' })
  async editarTutor(@Param('id') id: number, @Body() dto: CreateTutoresDto) {
    const tutor = await this.tutoresService.updateTutor(id, dto);
    return {
      message: 'Tutor actualizado correctamente',
      tutor,
    };
  }

  @Delete('EliminarTutor/:id')
  @ApiOperation({ summary: 'Eliminar Tutor (Logico)' })
  deleteTutores(@Param('id') id: number) {
    return this.tutoresService.deleteTutores(id);
  }
}
