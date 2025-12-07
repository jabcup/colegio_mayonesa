import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('estudiante')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombres: string;

  @Column({ type: 'varchar', length: 150 })
  apellidoPat: string;

  @Column({ type: 'varchar', length: 150 })
  apellidoMat: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  identificacion: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo_institucional: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  rude: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  telefono_referencia: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  sexo: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nacionalidad: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
