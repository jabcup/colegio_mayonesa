import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_pagos_estudiantes', synchronize: false })
export class VistaPagosEstudiantesView {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idEstudiante: number;

  @ViewColumn()
  estudiante: string;

  @ViewColumn()
  curso: string;

  @ViewColumn()
  paralelo: string;

  @ViewColumn()
  cantidad: number;

  @ViewColumn()
  descuento: number;

  @ViewColumn()
  total: number;

  @ViewColumn()
  mesPago: number;

  @ViewColumn()
  anioPago: number;

  @ViewColumn()
  estadoPago: string;
}
