import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Personal } from '../personal/personal.entity';  // Ajusta el path
import { AsignacionClase } from '../asignacion-clases/asignacionCursos.entity';

@Entity('notificaciones_docentes')
export class NotificacionesDocentes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  docente_id: number;

  @ManyToOne(() => Personal, { eager: true }) 
  @JoinColumn({ name: 'docente_id' })
  docente: Personal;

  @Column({ type: 'enum', enum: ['asignacion_curso', 'otro_tipo'], default: 'asignacion_curso' })
  tipo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ nullable: true })
  asignacion_id: number;

  @ManyToOne(() => AsignacionClase, { nullable: true })
  @JoinColumn({ name: 'asignacion_id' })
  asignacion: AsignacionClase;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ default: false })
  leida: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_leida: Date;

  @Column({ type: 'enum', enum: ['activo', 'inactivo'], default: 'activo' })
  estado: 'activo' | 'inactivo';
}