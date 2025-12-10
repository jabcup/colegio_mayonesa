import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VistaPagosEstudiantesView } from './vista-pagos.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(VistaPagosEstudiantesView)
    private readonly pagosViewRepo: Repository<VistaPagosEstudiantesView>,
  ) {}

  async buscarPagos(params: {
    curso?: string;
    estadoPago?: string;
    mesPago?: number;
    anioPago?: number;
  }) {
    const query = this.pagosViewRepo.createQueryBuilder('v');

    if (params.curso) {
      query.andWhere('v.curso LIKE :curso', { curso: `%${params.curso}%` });
    }

    if (params.estadoPago) {
      query.andWhere('v.estadoPago = :estado', { estado: params.estadoPago });
    }

    if (params.mesPago) {
      query.andWhere('v.mesPago = :mes', { mes: params.mesPago });
    }

    if (params.anioPago) {
      query.andWhere('v.anioPago = :anio', { anio: params.anioPago });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }
}
