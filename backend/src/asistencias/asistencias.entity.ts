import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';

@Entity('calificaciones')
export class Calificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AsignacionClase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idAsignacion' })
  asignacionClase: AsignacionClase;

  @Column({ type: 'bool', default: true })
  asistencia: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
