import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Curso } from '../cursos/cursos.entity';

@Entity('notificaciones')
export class Notificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCurso' })
  curso: Curso;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
