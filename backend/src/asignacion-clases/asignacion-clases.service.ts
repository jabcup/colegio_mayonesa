import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { Horarios } from 'src/horarios/horarios.entity';

@Injectable()
export class AsignacionClasesService {
    constructor(
        @InjectRepository(AsignacionClase)
        private readonly asignacionRepository: Repository<AsignacionClase>,
        @InjectRepository(Personal)
        private readonly personalRepository: Repository<Personal>,
        @InjectRepository(Curso)
        private readonly cursoRepository: Repository<Curso>,
        @InjectRepository(Materias)
        private readonly materiaRepository: Repository<Materias>,
        @InjectRepository(Horarios)
        private readonly horarioRepository: Repository<Horarios>,
        private dataSource: DataSource,
    ) {}

    async createAsignacionFull (dto: CreateAsignacionFulDto) {
        return this.dataSource.transaction(async (manager) => {

            const asignacion = manager.create(AsignacionClase, {
                dia: dto.dia,
            });

            const nuevaAsignacion = await manager.save(asignacion);

            const docente = await manager.findOne(Personal, {
                where: { id: dto.idPersonal },
            });

            if(!docente) {
                throw new Error('Docente no encontrado');
            }

            const curso = await manager.findOne(Curso, {
                where: { id: dto.idCurso },
            });

            if(!curso) {
                throw new Error ('Curso no encontrado');
            }

            const materia = await manager.findOne(Materias, {
                where: { id: dto.idMateria },
            });

            if(!materia){
                throw new Error('Materia no encontrado');
            }

            const horario = await manager.findOne(Horarios, {
                where: { id: dto.idHorario },
            });

            if(!horario) {
                throw new Error('Horario no encontrado');
            }

            return {
                message: 'Asignacion de curso creado exitosamente',
                asignacion: asignacion,
                docente: docente,
                curso: curso,
                materia: materia,
                horario: horario,
            };
        });
    }
}
