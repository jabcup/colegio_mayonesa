import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vista_tutores_cursos', synchronize: false })
export class VistaTutoresCurso {
  @ViewColumn()
  idUnico: number;

  @ViewColumn()
  idCurso: number;

  @ViewColumn()
  curso: string;

  @ViewColumn()
  paralelo: string;

  @ViewColumn()
  gestion: string;

  @ViewColumn()
  tutor_completo: string;

  @ViewColumn()
  idPersonal: number;

  @ViewColumn()
  telefono: string;

  @ViewColumn()
  correo: string;
}
