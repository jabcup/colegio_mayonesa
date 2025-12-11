import { Injectable, NotFoundException } from '@nestjs/common';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Curso } from '../cursos/cursos.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';
import { UpdateEstudianteFullDto } from './dto/update-estudiante-full.dto';

@Injectable()
export class EstudianteCursoService {
    constructor(
        @InjectRepository(EstudianteCurso)
        private readonly estudianteCursoRepository: Repository<EstudianteCurso>,
        @InjectRepository(Estudiante)
        private readonly estudianteRepository: Repository<Estudiante>,
        @InjectRepository(Curso)
        private readonly cursoRepository: Repository<Curso>,
        private dataSource: DataSource,
    ) {}

    async FindOneEst(id: number ): Promise<EstudianteCurso> {
        const estudianteCurso = await this.estudianteCursoRepository.findOne({
            where: { id },
            relations: ['estudiante', 'curso'],
        });
        if (!estudianteCurso) {
            throw new NotFoundException('Asignación no encontrada');
        }
        return estudianteCurso;
    }

    async FindOneCurso(id: number ): Promise<EstudianteCurso> {
        const estudianteCurso = await this.estudianteCursoRepository.findOne({
            where: { id },
            relations: ['curso', 'estudiante'],
        });
        if (!estudianteCurso) {
            throw new NotFoundException('Asignación no encontrada');
        }
        return estudianteCurso;
    }

    async updateEstudianteCursos(estudianteId: number, cursoIds: number) {
        return this.dataSource.transaction(async (manager) => {
            const estudiante = await manager.findOne(Estudiante, {
                where: { id: estudianteId },
            });
            if (!estudiante) {
                throw new NotFoundException('Estudiante no encontrado');
            }
            const cursos = await manager.findOne(Curso, {
                where: { id: cursoIds },
            });
            if (!cursos) {
                throw new NotFoundException(`Curso con ID ${cursoIds} no encontrado`);
            }
        }
        );
    }

    async deleteEstudianteCurso(id: number): Promise<EstudianteCurso> {
        const estudianteCurso = await this.estudianteCursoRepository.findOne({
            where: { id },
        });
        if (!estudianteCurso) {
            throw new NotFoundException('Asignación no encontrada');
        }
        estudianteCurso.estado = 'inactivo';
        return await this.estudianteCursoRepository.save(estudianteCurso);
    }

}

