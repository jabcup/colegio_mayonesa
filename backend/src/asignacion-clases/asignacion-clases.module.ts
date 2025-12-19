// src/asignacion-clases/asignacion-clases.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionClasesController } from './asignacion-clases.controller';
import { AsignacionClasesService } from './asignacion-clases.service';
import { Curso } from 'src/cursos/cursos.entity';
import { Horarios } from 'src/horarios/horarios.entity';
import { Materias } from 'src/materias/materias.entity';
import { Personal } from 'src/personal/personal.entity';
import { AsignacionClase } from './asignacionCursos.entity';
import { Usuarios } from 'src/usuarios/usuarios.entity';
import { EstudianteCurso } from 'src/estudiante-curso/estudiante_curso.entity';

// ← Importamos el módulo de notificaciones docentes
import { NotificacionesDocentesModule } from 'src/notificaciones-docentes/notificaciones-docentes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AsignacionClase,
      Personal,
      Curso,
      Materias,
      Horarios,
      Usuarios,
      EstudianteCurso,
    ]),
    NotificacionesDocentesModule,
  ],
  controllers: [AsignacionClasesController],
  providers: [AsignacionClasesService],
  exports: [AsignacionClasesService],
})
export class AsignacionClasesModule {}