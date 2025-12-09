import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';
import { Estudiante } from '../estudiante/estudiante.entity';

@Entity('asistencias')
export class Asistencias {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AsignacionClase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idAsignacion' })
  asignacionClase: AsignacionClase;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

  @Column({ type: 'enum', enum: ['presente', 'falta', 'ausente', 'justificativo'], default: 'presente' })
  asistencia: 'presente' | 'falta' | 'ausente' | 'justificativo' ;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
