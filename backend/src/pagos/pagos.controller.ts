import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly service: PagosService) {}

  @Post()
  create(@Body() dto: CreatePagoDto): Promise<PagoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<PagoResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PagoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePagoDto,
  ): Promise<PagoResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch('estudiante/:idEstudiante/pagar_ultima_gestion')
  @ApiResponse({
    status: 200,
    description: 'Cantidad de pagos actualizados',
    schema: {
      example: {
        message: 'Se marcaron como cancelados 3 pagos pendientes del último año.',
        updatedCount: 3,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cantidad de pagos actualizados' })
    async pagarUltimaGestion(
      @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    ): Promise<{ message: string; updatedCount: number }> {
    return this.service.pagarUltimaGestion(idEstudiante);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
