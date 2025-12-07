// estudiante-tutor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Padres } from '../padres/padres.entity';

@Entity('estudiante_tutor')
export class EstudianteTutor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

  @ManyToOne(() => Padres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPadre' })
  tutor: Padres;

  @Column({ type: 'varchar', length: 50, default: 'padre' })
  relacion: string; // 'padre', 'madre', 'tutor', 'abuelo', etc.

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
