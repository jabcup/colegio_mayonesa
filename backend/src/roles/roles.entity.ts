import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,

  //   CreateDateColumn,
} from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 150 })
  nombre: string;
  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
