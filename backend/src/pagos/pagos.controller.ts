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
  Injectable,
  PipeTransform,
  BadRequestException,
  ForbiddenException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { PagosComprobanteService } from './pagos-comprobante.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@Injectable()
class SoloIdPersonalPipe implements PipeTransform {
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
    private readonly comprobanteService: PagosComprobanteService,
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

  @Get('estudiante/:idEstudiante')
  @Public()
  @ApiOperation({ summary: 'Obtener la lista de pagos por estudiante' })
  async obtenerPagosPorEstudiante(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.service.obtenerPagosPorEstudiante(idEstudiante);
  }

  @Get('comprobante/:id')
  @ApiOperation({ summary: 'Descargar comprobante PDF de un pago' })
  @ApiResponse({ status: 200, description: 'PDF del comprobante' })
  async comprobante(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pagoEntity = await this.service.findOneRaw(id);
    if (pagoEntity.deuda !== 'cancelado') {
      throw new BadRequestException('El pago no está cancelado');
    }
    const pdf = await this.comprobanteService.generar(pagoEntity);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="comprobante-${id}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Post('comprobante-multiple')
  @ApiOperation({
    summary: 'Generar comprobante consolidado para múltiples pagos',
  })
  @ApiBody({
    schema: {
      example: { ids: [1, 2, 3] },
      properties: {
        ids: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'PDF del comprobante consolidado' })
  async comprobanteMultiple(@Body('ids') ids: number[], @Res() res: Response) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un ID de pago');
    }

    const pagos = await Promise.all(
      ids.map((id) => this.service.findOneRaw(id)),
    );

    const pagosPendientes = pagos.filter((p) => p.deuda !== 'cancelado');
    if (pagosPendientes.length > 0) {
      throw new BadRequestException('Todos los pagos deben estar cancelados');
    }

    const pdf = await this.comprobanteService.generarMultiple(pagos);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="comprobante-multiple.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago en específico' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PagoResponseDto> {
    return this.service.findOne(id);
  }

  @Patch('pagar/:id')
  @ApiOperation({ summary: 'Pagar (cancelar) uno o varios pagos' })
  @ApiBody({ schema: { example: { idpersonal: 123 } } })
  async pagar(
    @Param('id', ParseIntPipe) id: number,
    @Body(SoloIdPersonalPipe) dto: SoloIdPersonalBody,
  ): Promise<{ ok: boolean }> {
    if (!(await esCajero(this.usuariosRepo, dto.idpersonal))) {
      throw new ForbiddenException('El personal no es cajero o no está activo');
    }
    await this.service.pagar([id], dto.idpersonal);
    return { ok: true };
  }

  @Patch('pagar-trimestre')
  @ApiOperation({
    summary: 'Pagar un trimestre completo (3 mensualidades con 4% descuento)',
  })
  @ApiBody({
    schema: {
      example: { ids: [4, 5, 6], idpersonal: 123 },
      properties: {
        ids: { type: 'array', items: { type: 'number' } },
        idpersonal: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de la operación',
    schema: {
      example: {
        message: 'Se marcaron como cancelados 3 pagos.',
        updatedCount: 3,
      },
    },
  })
  async pagarTrimestre(
    @Body('ids') ids: number[],
    @Body('idpersonal') idpersonal: number,
  ) {
    return this.service.pagarTrimestre(ids, idpersonal);
  }

  @Patch('estudiante/:estudianteId/pagar-anio')
  @ApiOperation({
    summary:
      'Pagar todas las mensualidades pendientes del estudiante (descuento 10% si son 10)',
  })
  @ApiBody({ schema: { example: { idpersonal: 123 } } })
  @ApiResponse({
    status: 200,
    description: 'Resumen de la operación',
    schema: {
      example: {
        message: 'Se marcaron como cancelados X pagos.',
        updatedCount: 10,
      },
    },
  })
  async pagarAnio(
    @Param('estudianteId', ParseIntPipe) estudianteId: number,
    @Body('idpersonal') idpersonal: number,
  ) {
    try {
      return await this.service.pagarAnio(estudianteId, idpersonal);
    } catch (e) {
      const message = (e as any)?.message || 'Error al pagar año';
      throw new BadRequestException(message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un pago' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePagoDto,
  ): Promise<PagoResponseDto> {
    return this.service.update(id, dto);
  }

  // @Patch('estudiante/:idEstudiante/pagar_ultima_gestion')
  // @ApiOperation({
  //   summary: 'Pagar toda la última gestión (año) pendiente de un estudiante',
  // })
  // @ApiBody({ schema: { example: { idpersonal: 123 } } })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Cantidad de pagos actualizados',
  //   schema: {
  //     example: {
  //       message:
  //         'Se marcaron como cancelados 3 pagos pendientes del último año.',
  //       updatedCount: 3,
  //     },
  //   },
  // })

  @Delete('eliminar/:id')
  @ApiOperation({ summary: 'Eliminación lógica de un pago' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
