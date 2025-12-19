import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_calificaciones_por_estudiante', synchronize: false })
export class VistaCalificacionesEstudiante {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idCalificacion: number;

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
  materia: string;

  @ViewColumn()
  trim1: number;

  @ViewColumn()
  trim2: number;

  @ViewColumn()
  trim3: number;

  @ViewColumn()
  calificacionFinal: number;

  @ViewColumn()
  estado: string;

  @ViewColumn()
  fecha_creacion: Date;
}
