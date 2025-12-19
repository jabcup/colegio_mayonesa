import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Paralelos } from '../paralelos/paralelo.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  nombre: string;

  // @Column({
  //   type: 'char',
  //   length: 1,
  //   nullable: false,
  // })
  // paralelo: string;

  @ManyToOne(() => Paralelos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idParalelo' })
  paralelo: Paralelos;

  @Column({
    type: 'int',
    nullable: false,
  })
  gestion: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  capacidad: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCreacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
