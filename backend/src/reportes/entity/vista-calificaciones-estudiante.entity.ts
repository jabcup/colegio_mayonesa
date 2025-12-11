import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_calificaciones_estudiante' })
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
  calificacion: number;

  @ViewColumn()
  estado: string;

  @ViewColumn()
  fecha_creacion: Date;
}
