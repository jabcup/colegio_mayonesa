import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Personal } from '../personal/personal.entity';
import { Curso } from '../cursos/cursos.entity';
import { Materias } from '../materias/materias.entity';
import { Horarios } from '../horarios/horarios.entity';

@Entity('asignacionClases')
export class asignacionClase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  dia: string;

  @ManyToOne(() => Personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPersonal' })
  personal: Personal;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCurso' })
  curso: Curso;

  @ManyToOne(() => Materias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMateria' })
  materia: Materias;

  @ManyToOne(() => Horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idHorario' })
  horario: Horarios;
}
