import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('personal')
export class Personal {
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

  @Column({ type: 'varchar', length: 150, nullable: true })
  identificacion: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
