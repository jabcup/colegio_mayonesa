import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { asignacionClase } from '../asignacion-clases/asignacionCursos.entity';

@Entity('calificaciones')
export class Calificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => asignacionClase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idAsignacion' })
  asignacionClase: asignacionClase;

  @Column({ type: 'varchar', length: 150 })
  calificacion: string;

  @Column({ type: 'bool', default: true })
  aprobacion: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
