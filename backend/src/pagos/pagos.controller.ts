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
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PersonalService } from 'src/personal/personal.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

class SoloIdPersonal implements PipeTransform {
  transform(value: any) {
    const keys = Object.keys(value);
    if (keys.length !== 1 || keys[0] !== 'idpersonal')
      throw new BadRequestException(
        'El body debe contener únicamente "idpersonal"',
      );
    if (typeof value.idpersonal !== 'number')
      throw new BadRequestException('"idpersonal" debe ser un número');
    return { idpersonal: value.idpersonal };
  }
}

interface SoloIdPersonalBody {
  idpersonal: number;
}

async function esCajero(
  usuarioRepository: Repository<Usuarios>,
  idPersonal: number,
): Promise<boolean> {
  const usuario = await usuarioRepository
    .createQueryBuilder('u')
    .leftJoinAndSelect('u.rol', 'r')
    .where('u.idPersonal = :id', { id: idPersonal })
    .getOne();
  return usuario?.rol?.nombre === 'Cajero' && usuario.estado === 'activo';
}

@UseGuards(JwtAuthGuard)
@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(
    private readonly service: PagosService,
    private readonly usuariosService: UsuariosService,
    @InjectRepository(Usuarios)
    private readonly usuariosRepo: Repository<Usuarios>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creación de un pago' })
  create(@Body() dto: CreatePagoDto): Promise<PagoResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de pagos' })
  findAll(): Promise<PagoResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':idEstudiante')
  @ApiOperation({ summary: 'Obtener la lista de pagos por estudiante' })
  async obtenerPagosPorEstudiante(@Param('idEstudiante') idEstudiante: number) {
    return this.service.obtenerPagosPorEstudiante(idEstudiante);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago en específico' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PagoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch('pagar/:id')
  @ApiOperation({ summary: 'Pagar (cancelar) un pago' })
  @ApiBody({ schema: { example: { idpersonal: 123 } } })
  async pagar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SoloIdPersonalBody,
  ): Promise<{ ok: boolean }> {
    if (!(await esCajero(this.usuariosRepo, dto.idpersonal))) {
      throw new ForbiddenException('El personal no es cajero o no está activo');
    }

    await this.service.pagar(id, dto);
    return { ok: true };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un pago' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePagoDto,
  ): Promise<PagoResponseDto> {
    return this.service.update(id, dto);
  }

  @Patch('estudiante/:idEstudiante/pagar_ultima_gestion')
  @ApiOperation({ summary: 'Pagar todo un año de un estudiante' })
  @ApiBody({ schema: { example: { idpersonal: 123 } } })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de pagos actualizados',
    schema: {
      example: {
        message:
          'Se marcaron como cancelados 3 pagos pendientes del último año.',
        updatedCount: 3,
      },
    },
  })
  async pagarUltimaGestion(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Body(SoloIdPersonal) dto: SoloIdPersonalBody,
  ): Promise<{ message: string; updatedCount: number }> {
    if (!(await esCajero(this.usuariosRepo, dto.idpersonal))) {
      throw new ForbiddenException('El personal no es cajero o no está activo');
    }
    return this.service.pagarUltimaGestion(idEstudiante, dto.idpersonal);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminación de un pago de la base de datos' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
