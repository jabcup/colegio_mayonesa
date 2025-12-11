import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_estudiantes_por_curso' })
export class VistaEstudiantesCurso {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idEstudiante: number;

  @ViewColumn()
  estudiante: string;

  @ViewColumn()
  identificacion: string;

  @ViewColumn()
  rude: string;

  @ViewColumn()
  correo_institucional: string;

  @ViewColumn()
  telefono_referencia: string;

  @ViewColumn()
  curso: string;

  @ViewColumn()
  paralelo: string;

  @ViewColumn()
  gestion: string;
}
