import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagos } from './pagos.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pagos)
    private readonly repo: Repository<Pagos>,
  ) {}

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

  async remove(id: number): Promise<void> {
    const pago = await this.findOne(id);
    await this.repo.update(id, { estado: 'inactivo' });
  }

  private toResponse(p: Pagos): PagoResponseDto {
    return {
      id: p.id,
      idEstudiante: p.estudiante.id,
      idPersonal: p.personal.id,
      cantidad: p.cantidad,
      descuento: p.descuento,
      total: p.total,
      fecha_creacion: p.fecha_creacion,
      estado: p.estado,
    };
  }
}
