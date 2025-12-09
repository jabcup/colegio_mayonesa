import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/cursos.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAsignacionFulDto } from './dto/create-asignacion-full.dto';
import { Horarios } from 'src/horarios/horarios.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';

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
        @InjectRepository(Usuarios)
        private readonly usuariosRepository: Repository<Usuarios>,
        private dataSource: DataSource,
    ) { }

    async createAsignacionFull(dto: CreateAsignacionFulDto) {
        return this.dataSource.transaction(async (manager) => {
            const asignacionExistente = await this.asignacionRepository.findOne({
                where: {
                    personal: { id: dto.idPersonal },
                    curso: { id: dto.idCurso },
                    materia: { id: dto.idMateria },
                    horario: { id: dto.idHorario },
                    dia: dto.dia,
                },
            });

            if (asignacionExistente) {
                throw new Error('Esta asignación ya existe');
            }

            const docente = await this.personalRepository.findOne({
                where: { id: dto.idPersonal },
            });

            if (!docente) {
                throw new Error('Personal no encontrado');
            }

            const usuario = await this.usuariosRepository.findOne({
                where: { personal: { id: dto.idPersonal } },
                relations: ['rol'],
            });

            if (!usuario || usuario.rol.nombre.toLowerCase() !== 'docente') {
                throw new Error('El personal no es un docente');
            }

            const curso = await this.cursoRepository.findOne({
                where: { id: dto.idCurso },
            });

            if (!curso) {
                throw new Error('Curso no encontrado');
            }

            const materia = await this.materiaRepository.findOne({
                where: { id: dto.idMateria },
            });

            if (!materia) {
                throw new Error('Materia no encontrada');
            }

            const horario = await this.horarioRepository.findOne({
                where: { id: dto.idHorario },
            });

            if (!horario) {
                throw new Error('Horario no encontrado');
            }

            const asignacion = manager.create(AsignacionClase, {
                dia: dto.dia,
                personal: docente,
                curso: curso,
                materia: materia,
                horario: horario,
            });

            const nuevaAsignacion = await manager.save(asignacion);

            return {
                message: 'Asignación de curso creada exitosamente',
                asignacion: nuevaAsignacion,
            };
        });
    }

}
