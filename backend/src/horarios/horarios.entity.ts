import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('horarios')
export class Horarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  horario: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
