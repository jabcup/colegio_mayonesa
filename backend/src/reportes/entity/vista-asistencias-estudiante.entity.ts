import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_asistencia_por_estudiante', synchronize: false })
export class VistaAsistenciasEstudiante {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idAsistencia: number;

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
  fecha: Date;

  @ViewColumn()
  estado_asistencia: string;
}
