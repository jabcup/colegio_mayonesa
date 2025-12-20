import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Paralelos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 1 })
  nombre: string;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
