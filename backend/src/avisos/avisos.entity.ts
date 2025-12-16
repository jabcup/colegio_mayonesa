import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Curso } from '../cursos/cursos.entity'; // Asumiendo que la entidad Curso existe en esta ruta; ajústala si es necesario
import { Personal } from '../personal/personal.entity';

@Entity('avisos')
export class Avisos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCurso' })
  Curso: Curso;

  @ManyToOne(() => Personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPersonal' })
  Personal: Personal;

  @Column({ type: 'varchar', length: 150 })
  asunto: string;

  @Column({ type: 'varchar', length: 150 })
  mensaje: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}