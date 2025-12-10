import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Pagos } from './pagos.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';
import { plainToClass } from 'class-transformer';
import { Personal } from 'src/personal/personal.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pagos)
    private readonly repo: Repository<Pagos>,
  ) {}
async pagarUltimaGestion(idEstudiante: number): Promise<{ message: string; updatedCount: number }> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const pagosPendientes = await this.repo.find({
    where: {
      estudiante: { id: idEstudiante },
      deuda: 'pendiente',
      fecha_creacion: MoreThanOrEqual(oneYearAgo),
    },
  });

  if (pagosPendientes.length === 0) {
    return { message: 'No hay pagos pendientes del último año.', updatedCount: 0 };
  }

  for (const p of pagosPendientes) {
    const descActual       = Number(p.descuento);
    const descuentoAdicional = Number((Number(p.cantidad) * 0.1).toFixed(2));
    const nuevoDescuento   = Number((descActual + descuentoAdicional).toFixed(2));
    const nuevoTotal       = Number((Number(p.cantidad) - nuevoDescuento).toFixed(2));

    await this.repo.update(p.id, {
      descuento: nuevoDescuento,
      total: nuevoTotal,
      deuda: 'cancelado',
    });
  }

  return {
    message: `Se marcaron como cancelados ${pagosPendientes.length} pagos con un 10 % de descuento adicional.`,
    updatedCount: pagosPendientes.length,
  };
}
  async create(dto: CreatePagoDto): Promise<PagoResponseDto> {
    const pago = this.repo.create({
      estudiante: { id: dto.idEstudiante } as any,
      personal:   { id: dto.idPersonal }   as any,
      cantidad:   dto.cantidad,
      descuento:  dto.descuento,
      total:      dto.total,
    });
    const saved = await this.repo.save(pago);
    return this.toResponse(saved);
  }

  async findAll(): Promise<PagoResponseDto[]> {
    const pagos = await this.repo.find({ relations: ['estudiante', 'personal'] });
    return pagos.map(p => this.toResponse(p));
  }

  async findOne(id: number): Promise<PagoResponseDto> {
    const pago = await this.repo.findOne({
      where: { id },
      relations: ['estudiante', 'personal'],
    });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return this.toResponse(pago);
  }

  async update(id: number, dto: UpdatePagoDto): Promise<PagoResponseDto> {
    await this.repo.update(id, {
      estudiante: dto.idEstudiante ? { id: dto.idEstudiante } as any : undefined,
      personal:   dto.idPersonal   ? { id: dto.idPersonal }   as any : undefined,
      cantidad:   dto.cantidad,
      descuento:  dto.descuento,
      total:      dto.total,
    });
    return this.findOne(id);
  }

async pagar(idPago: number, dto: { idpersonal: number }): Promise<Pagos> {
  const pago = await this.repo.findOneBy({ id: idPago });
  if (!pago) throw new NotFoundException('Pago no encontrado');

  pago.deuda = 'cancelado';         
  pago.personal = { id: dto.idpersonal } as Personal;

  return this.repo.save(pago);
}


  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.repo.update(id, { estado: 'inactivo' });
  }

  private toResponse(p: Pagos): PagoResponseDto {
    return {
      id: p.id,
      idEstudiante: p.estudiante.id,
      // idPersonal: p.personal.id,
      cantidad: p.cantidad,
      descuento: p.descuento,
      total: p.total,
      fecha_creacion: p.fecha_creacion,
      estado: p.estado,
    };
  }
}
