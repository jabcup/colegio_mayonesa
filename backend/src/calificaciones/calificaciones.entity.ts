import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
// import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';
import { Materias } from '../materias/materias.entity';
import { Estudiante } from '../estudiante/estudiante.entity';

@Entity('calificaciones')
export class Calificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => AsignacionClase, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'idAsignacion' })
  // asignacionClase: AsignacionClase;

  @ManyToOne(() => Materias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMateria' })
  materia: Materias;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  calificacion: number;

  @Column({ type: 'bool', default: true })
  aprobacion: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
