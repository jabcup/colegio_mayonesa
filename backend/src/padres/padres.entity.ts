import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Padres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombres: string;

  @Column({ type: 'varchar', length: 150 })
  apellidoPat: string;

  @Column({ type: 'varchar', length: 150 })
  apellidoMat: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  telefono: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
