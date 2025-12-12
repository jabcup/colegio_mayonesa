import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Personal } from '../personal/personal.entity';
import { Curso } from '../cursos/cursos.entity';
import { Materias } from '../materias/materias.entity';
import { Horarios } from '../horarios/horarios.entity';

@Entity('asignacion_clases')
export class AsignacionClase {
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

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
