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

  @ManyToOne(() => Materias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMateria' })
  materia: Materias;

  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;

<<<<<<< HEAD
  @Column({
    type: 'int',
  })
  anioEscolar: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  trim1: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  trim2: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  trim3: number;
=======
  // @Column({
  //   type: 'int',
  //   comment: '1 = Primer trimestre, 2 = Segundo, 3 = Tercero',
  // })
  // trimestre: number;

  // @Column({
  //   type: 'int',
  // })
  // anioEscolar: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  calificacion: number;
>>>>>>> charu

  @Column({ type: 'bool', default: true })
  aprobacion: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
