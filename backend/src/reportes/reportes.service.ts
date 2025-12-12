import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VistaPagosEstudiantesView } from './entity/vista-pagos.entity';
import { VistaPagosPorEstudiante } from './entity/vista-pagos-estudiante.entity';
import { VistaCalificacionesCurso } from './entity/vista-calificaciones-curso.entity';
import { VistaCalificacionesEstudiante } from './entity/vista-calificaciones-estudiante.entity';
import { VistaAsistenciasEstudiante } from './entity/vista-asistencias-estudiante.entity';
import { VistaAsistenciasCurso } from './entity/vista-asistencias-curso.entity';
import { VistaTutoresCurso } from './entity/vista-tutores-curso.entity';
import { VistaEstudiantesCurso } from './entity/vista-estuidantes-curso.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(VistaPagosEstudiantesView)
    private readonly pagosViewRepo: Repository<VistaPagosEstudiantesView>,
    @InjectRepository(VistaPagosPorEstudiante)
    private readonly pagosPorEstudianteRepo: Repository<VistaPagosPorEstudiante>,
    @InjectRepository(VistaCalificacionesCurso)
    private readonly calificacionesCursoRepo: Repository<VistaCalificacionesCurso>,
    @InjectRepository(VistaCalificacionesEstudiante)
    private readonly calificacionesEstudianteRepo: Repository<VistaCalificacionesEstudiante>,
    @InjectRepository(VistaAsistenciasEstudiante)
    private readonly asistenciasEstudianteRepo: Repository<VistaAsistenciasEstudiante>,
    @InjectRepository(VistaAsistenciasCurso)
    private readonly asistenciasCursoRepo: Repository<VistaAsistenciasCurso>,
    @InjectRepository(VistaTutoresCurso)
    private readonly tutoresCursoRepo: Repository<VistaTutoresCurso>,
    @InjectRepository(VistaEstudiantesCurso)
    private readonly estudiantesCursoRepo: Repository<VistaEstudiantesCurso>,
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

  async buscarPagosPorEstudiante(idEstudiante: number) {
    const query = this.pagosPorEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();
    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async buscarCalificacionesPorCurso(params: {
    curso?: string;
    paralelo?: string;
    gestion?: number;
  }) {
    const query = this.calificacionesCursoRepo.createQueryBuilder('v');

    if (params.curso) {
      query.andWhere('v.curso LIKE :curso', { curso: `%${params.curso}%` });
    }

    if (params.paralelo) {
      query.andWhere('v.paralelo = :paralelo', { paralelo: params.paralelo });
    }

    if (params.gestion) {
      query.andWhere('v.gestion = :gestion', { gestion: params.gestion });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async buscarCalificacionesPorEstudiante(idEstudiante: number) {
    const query = this.calificacionesEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async buscarAsistenciasPorCurso(params: {
    curso?: string;
    paralelo?: string;
    gestion?: number;
    mes?: number;
  }) {
    const query = this.asistenciasCursoRepo.createQueryBuilder('v');

    if (params.curso) {
      query.andWhere('v.curso LIKE :curso', { curso: `%${params.curso}%` });
    }

    if (params.paralelo) {
      query.andWhere('v.paralelo = :paralelo', { paralelo: params.paralelo });
    }

    if (params.gestion) {
      query.andWhere('v.gestion = :gestion', { gestion: params.gestion });
    }

    if (params.mes) {
      query.andWhere('MONTH(v.fecha) = :mes', { mes: params.mes });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async buscarAsistenciaPorEstudiante(idEstudiante: number) {
    const query = this.asistenciasEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async listarTutores() {
    const resultados = await this.tutoresCursoRepo
      .createQueryBuilder('v')
      .getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async buscarEstudiantesPorCurso(params: {
    curso?: string;
    paralelo?: string;
    gestion?: number;
  }) {
    const query = this.estudiantesCursoRepo.createQueryBuilder('v');

    if (params.curso) {
      query.andWhere('v.curso LIKE :curso', { curso: `%${params.curso}%` });
    }

    if (params.paralelo) {
      query.andWhere('v.paralelo = :paralelo', { paralelo: params.paralelo });
    }

    if (params.gestion) {
      query.andWhere('v.gestion = :gestion', { gestion: params.gestion });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }
}
