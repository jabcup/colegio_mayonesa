import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({
    type: 'char',
    length: 1,
    nullable: false,
  })
  paralelo: string;

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
