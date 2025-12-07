import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Personal } from '../personal/personal.entity';
import { Roles } from '../roles/roles.entity';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPersonal' }) // Esto crea la columna personal_id
  personal: Personal;

  @OneToOne(() => Roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idRol' }) // Esto crea la columna rol_id
  rol: Roles;

  @Column({ type: 'varchar', length: 150 })
  correo_institucional: string;

  @Column({ type: 'varchar', length: 150 })
  contrasena: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
