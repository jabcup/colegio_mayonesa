import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pagos, Mes } from './pagos.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoResponseDto } from './dto/response-pago.dto';
import { Personal } from 'src/personal/personal.entity';
import { PagosComprobanteService } from './pagos-comprobante.service';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pagos)
    private readonly repo: Repository<Pagos>,
    @InjectRepository(Personal)
    private readonly personalRepo: Repository<Personal>,
    private readonly comprobanteService: PagosComprobanteService,
  ) {}

  async create(dto: CreatePagoDto): Promise<PagoResponseDto> {
    const p = this.repo.create({
      estudiante: { id: dto.idEstudiante },
      personal: dto.idPersonal ? ({ id: dto.idPersonal } as any) : null,
      cantidad: dto.cantidad,
      descuento: dto.descuento,
      total: dto.total,
      deuda: dto.deuda,
      concepto: dto.concepto,
      anio: dto.anio ?? new Date().getFullYear(),
      mes: dto.mes ?? null,
      tipo: dto.tipo ?? 'mensual',
    });
    const saved = await this.repo.save(p);
    return this.toResponse(saved);
  }

  async findAll(): Promise<PagoResponseDto[]> {
    const list = await this.repo.find({
      relations: ['estudiante', 'personal'],
    });
    return list.map((x) => this.toResponse(x));
  }

  async findOne(id: number): Promise<PagoResponseDto> {
    const p = await this.repo.findOne({
      where: { id },
      relations: ['estudiante', 'personal'],
    });
    if (!p) throw new NotFoundException('Pago no encontrado');
    return this.toResponse(p);
  }

  async update(id: number, dto: UpdatePagoDto): Promise<PagoResponseDto> {
    await this.repo.update(id, {
      estudiante: dto.idEstudiante ? { id: dto.idEstudiante } : undefined,
      personal: dto.idPersonal !== undefined ? { id: dto.idPersonal } : null,
      cantidad: dto.cantidad,
      descuento: dto.descuento,
      total: dto.total,
      deuda: dto.deuda,
      concepto: dto.concepto,
      anio: dto.anio,
      mes: dto.mes,
      tipo: dto.tipo,
    } as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const p = await this.findOne(id);
    await this.repo.update(id, { estado: 'inactivo' });
  }

  private async primeraPendiente(estudianteId: number): Promise<Pagos | null> {
    return this.repo.findOne({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'pendiente',
        tipo: 'mensual',
      },
      order: { anio: 'ASC', mes: 'ASC' },
    });
  }

  async previewPago(ids: number[], esTrimestre: boolean = false) {
    const pendientes = await this.repo.find({
      where: { id: In(ids), deuda: 'pendiente' },
    });
    if (pendientes.length !== ids.length)
      throw new BadRequestException(
        'Algunas mensualidades no están pendientes',
      );

    const subTotal = pendientes.reduce((s, p) => s + Number(p.cantidad), 0);
    let descuento = 0;
    const esMensual = pendientes.every((p) => p.tipo === 'mensual');

    if (esMensual) {
      if (esTrimestre && pendientes.length === 3) {
        descuento = Number((subTotal * 0.04).toFixed(2));
      } else if (!esTrimestre && pendientes.length === 10) {
        descuento = Number((subTotal * 0.1).toFixed(2));
      }
    }

    return {
      subTotal,
      descuento,
      total: Number((subTotal - descuento).toFixed(2)),
    };
  }

  async pagar(ids: number[], idPersonal: number, esTrimestre: boolean = false) {
    if (!ids.length) throw new BadRequestException('Faltan ids');

    const pendientes = await this.repo.find({
      where: { id: In(ids), deuda: 'pendiente' },
      relations: ['estudiante'],
      order: { anio: 'ASC', mes: 'ASC' },
    });
    if (pendientes.length !== ids.length)
      throw new BadRequestException(
        'Algunas mensualidades no están pendientes',
      );

    const estudianteId = pendientes[0].estudiante.id;

    const primera = await this.primeraPendiente(estudianteId);
    if (!primera)
      throw new BadRequestException('No hay mensualidades pendientes');
    if (primera.id !== pendientes[0].id)
      throw new BadRequestException(
        'Debe empezar por la mensualidad pendiente más antigua',
      );

    const meses = pendientes
      .map((p) => ({ anio: p.anio, mes: p.mes }))
      .sort((a, b) => {
        if (a.anio !== b.anio) return a.anio - b.anio;
        return a.mes - b.mes;
      });
    for (let i = 1; i < meses.length; i++) {
      const { anio: aAnio, mes: aMes } = meses[i - 1];
      const { anio: bAnio, mes: bMes } = meses[i];
      const esperadoMes = aMes === 12 ? 1 : aMes + 1;
      const esperadoAnio = aMes === 12 ? aAnio + 1 : aAnio;
      if (bAnio !== esperadoAnio || bMes !== esperadoMes)
        throw new BadRequestException(
          'Los meses a pagar deben ser consecutivos entre sí',
        );
    }

    const { descuento } = await this.previewPago(ids, esTrimestre);
    const now = new Date();

    for (const p of pendientes) {
      const parteDesc = Number((descuento / pendientes.length).toFixed(2));
      await this.repo.update(p.id, {
        deuda: 'cancelado',
        descuento: Number(p.descuento) + parteDesc,
        total: Number(p.cantidad) - parteDesc,
        personal: { id: idPersonal } as any,
        fecha_pago: now,
      });
    }

    return {
      message: `Se marcaron como cancelados ${pendientes.length} pagos.`,
      updatedCount: pendientes.length,
    };
  }

  async pagarTrimestre(ids: number[], idPersonal: number) {
    if (ids.length !== 3)
      throw new BadRequestException('Debe enviar exactamente 3 mensualidades');

    const estudianteId = (
      await this.repo.findOneOrFail({
        where: { id: ids[0] },
        relations: ['estudiante'],
      })
    ).estudiante.id;

    const tres = await this.repo.find({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'pendiente',
        tipo: 'mensual',
      },
      order: { anio: 'ASC', mes: 'ASC' },
      take: 3,
    });
    if (tres.length < 3)
      throw new BadRequestException(
        'No hay 3 mensualidades pendientes para formar un trimestre',
      );

    const esperados = tres.map((p) => p.id).sort((a, b) => a - b);
    const recibidos = ids.sort((a, b) => a - b);
    if (esperados.join(',') !== recibidos.join(','))
      throw new BadRequestException(
        'Los ids deben ser las 3 mensualidades pendientes más antiguas y consecutivas',
      );

    return this.pagar(ids, idPersonal, true);
  }

  async pagarAnio(estudianteId: number, idPersonal: number) {
    const pendientes = await this.repo.find({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'pendiente',
        tipo: 'mensual',
      },
      order: { anio: 'ASC', mes: 'ASC' },
    });

    if (pendientes.length === 0)
      throw new BadRequestException('No hay mensualidades pendientes');

    return this.pagar(
      pendientes.map((p) => p.id),
      idPersonal,
      false,
    );
  }

  private toResponse(p: Pagos): PagoResponseDto {
    return {
      id: p.id,
      idEstudiante: p.estudiante.id,
      idPersonal: p.personal?.id ?? null,
      cantidad: p.cantidad,
      descuento: p.descuento,
      total: p.total,
      deuda: p.deuda,
      concepto: p.concepto,
      fecha_creacion: p.fecha_creacion,
      fecha_pago: p.fecha_pago,
      estado: p.estado,
      anio: p.anio,
      mes: p.mes,
      tipo: p.tipo,
    };
  }

  async findOneRaw(id: number): Promise<Pagos> {
    const p = await this.repo.findOne({
      where: { id },
      relations: ['estudiante', 'personal'],
    });
    if (!p) throw new NotFoundException('Pago no encontrado');
    return p;
  }

  async generarComprobanteAnio(estudianteId: number, idPersonal?: number) {
    // Buscamos la fecha de pago más reciente de pagos mensuales cancelados del estudiante
    const ultimoPago = await this.repo.findOne({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'cancelado',
        tipo: 'mensual',
        fecha_pago: Not(IsNull()),
      },
      order: { fecha_pago: 'DESC' },
    });

    if (!ultimoPago || !ultimoPago.fecha_pago) {
      throw new NotFoundException('No se encontraron pagos anuales recientes');
    }

    const fechaUltimoPago = ultimoPago.fecha_pago;

    let pagosPagados = await this.repo.find({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'cancelado',
        tipo: 'mensual',
        fecha_pago: fechaUltimoPago,
      },
      relations: ['estudiante'],
      order: { anio: 'ASC', mes: 'ASC' },
    });

    if (pagosPagados.length < 10) {
      throw new NotFoundException(
        'No se encontraron exactamente 10 mensualidades del último pago anual',
      );
    }

    if (pagosPagados.length > 10) {
      // En teoría no debería pasar, pero por seguridad tomamos los primeros 10 en orden
      pagosPagados = pagosPagados.slice(0, 10);
    }

    return this.comprobanteService.generarAnual(pagosPagados, idPersonal);
  }

  async generarComprobanteTrimestre(estudianteId: number, idPersonal?: number) {
    // Buscar el pago mensual cancelado más reciente del estudiante
    const ultimoPago = await this.repo.findOne({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'cancelado',
        tipo: 'mensual',
        fecha_pago: Not(IsNull()),
      },
      order: { fecha_pago: 'DESC' },
    });

    if (!ultimoPago || !ultimoPago.fecha_pago) {
      throw new NotFoundException(
        'No se encontraron pagos trimestrales recientes',
      );
    }

    const fechaUltimoPago = ultimoPago.fecha_pago;

    // Buscar todos los pagos mensuales cancelados con esa misma fecha_pago
    let pagosPagados = await this.repo.find({
      where: {
        estudiante: { id: estudianteId },
        deuda: 'cancelado',
        tipo: 'mensual',
        fecha_pago: fechaUltimoPago,
      },
      relations: ['estudiante'],
      order: { anio: 'ASC', mes: 'ASC' },
    });

    // Para trimestre esperamos exactamente 3
    if (pagosPagados.length !== 3) {
      throw new NotFoundException(
        'No se encontraron exactamente 3 mensualidades del último pago trimestral',
      );
    }

    return this.comprobanteService.generarTrimestre(pagosPagados, idPersonal);
  }
}
