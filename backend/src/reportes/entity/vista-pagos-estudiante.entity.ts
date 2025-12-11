import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_pagos_por_estudiante' })
export class VistaPagosPorEstudiante {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idPago: number;

  @ViewColumn()
  idEstudiante: number;

  @ViewColumn()
  estudiante: string;

  @ViewColumn()
  curso: string;

  @ViewColumn()
  paralelo: string;

  @ViewColumn()
  gestion: string;

  @ViewColumn()
  cantidad: number;

  @ViewColumn()
  descuento: number;

  @ViewColumn()
  total: number;

  @ViewColumn()
  estadoPago: string;

  @ViewColumn()
  fecha_creacion: Date;
}
