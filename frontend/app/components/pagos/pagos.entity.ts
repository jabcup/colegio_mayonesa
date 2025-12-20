import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Personal } from '../personal/personal.entity';
export type Mes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type TipoPago = 'mensual' | 'trimestral';
@Entity('pagos')
export class Pagos {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Estudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEstudiante' })
  estudiante: Estudiante;
  @ManyToOne(() => Personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPersonal' })
  personal: Personal;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
  @Column({
    type: 'enum',
    enum: ['pendiente', 'cancelado'],
    default: 'pendiente',
  })
  deuda: 'pendiente' | 'cancelado';
  @Column({ type: 'varchar', length: 150, nullable: false })
  concepto: string;
  @Column({ type: 'int', nullable: true })
  anio: number;
  @Column({ type: 'int', nullable: true })
  mes: Mes;
  @Column({ type: 'enum', enum: ['mensual', 'trimestral'], default: 'mensual' })
  tipo: TipoPago;
  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  fecha_pago: Date;
  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}
