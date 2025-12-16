import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  tabla: string;

  @Column({ type: 'enum', enum: ['POST', 'PUT', 'DELETE'] })
  operacion: 'POST' | 'PUT' | 'DELETE';

  @Column({ type: 'int', nullable: true })
  idRegistro: number;

  @Column({ type: 'json', nullable: true })
  datosAntes: any;

  @Column({ type: 'json', nullable: true })
  datosDespues: any;

  @Column({ type: 'int' })
  usuarioId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_registro' })
  fecha_registro: Date;
}
