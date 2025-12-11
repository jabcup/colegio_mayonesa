import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_asistencias_curso' })
export class VistaAsistenciasCurso {
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
