import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Personal } from '../personal/personal.entity';

@Entity('notificaciones')
export class Notificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

  @ManyToOne(() => Personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPersonal' })
  personal: Personal;

  @Column({ type: 'varchar', length: 150 })
  asunto: string;

  @Column({ type: 'varchar', length: 150 })
  mensaje: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
