import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VistaPagosEstudiantesView } from './entity/vista-pagos.entity';
import { VistaPagosPorEstudiante } from './entity/vista-pagos-estudiante.entity';
import { VistaCalificacionesCurso } from './entity/vista-calificaciones-curso.entity';
import { VistaCalificacionesEstudiante } from './entity/vista-calificaciones-estudiante.entity';
import { VistaAsistenciasEstudiante } from './entity/vista-asistencias-estudiante.entity';
import { VistaAsistenciasCurso } from './entity/vista-asistencias-curso.entity';
import { VistaTutoresCurso } from './entity/vista-tutores-curso.entity';
import { VistaEstudiantesCurso } from './entity/vista-estuidantes-curso.entity';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Interfaz para los datos que se usarán en el PDF
export interface CalificacionReporte {
  estudiante: string; // nombre completo del estudiante
  materia: string; // nombre de la materia
  trim1: number;
  trim2: number;
  trim3: number;
  calificacionFinal: number; // calificación obtenida
}

export interface PagoCursoReporte {
  numero: number;
  estudiante: string;
  curso: string;
  paralelo: string;
  mesPago: number;
  anioPago: number;
  total: number;
  estadoPago: string;
}

export interface PagoPorEstudianteReporte {
  numero: number;
  estudiante: string;
  curso: string;
  paralelo: string;
  gestion: string;
  total: number;
  estadoPago: string;
  fecha_creacion: Date;
}

export interface CalificacionEstudianteReporte {
  numero: number;
  estudiante: string;
  curso: string;
  paralelo: string;
  gestion: string;
  materia: string;
  trim1: number;
  trim2: number;
  trim3: number;
  calificacionFinal: number;
  estado: string;
}

export interface AsistenciaCursoReporte {
  numero: number;
  estudiante: string;
  curso: string;
  paralelo: string;
  gestion: string;
  fecha: Date;
  estado_asistencia: string;
}

export interface AsistenciaEstudianteReporte {
  numero: number;
  estudiante: string;
  curso: string;
  paralelo: string;
  gestion: string;
  fecha: Date;
  estado_asistencia: string;
}

export interface EstudianteCursoReporte {
  numero: number;
  estudiante: string;
  identificacion: string;
  rude: string;
  correo_institucional: string;
  telefono_referencia: string;
  curso: string;
  paralelo: string;
  gestion: string;
}

export interface TutorCursoReporte {
  numero: number;
  curso: string;
  paralelo: string;
  gestion: string;
  tutor_completo: string;
  telefono: string;
  correo: string;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(VistaPagosEstudiantesView)
    private readonly pagosViewRepo: Repository<VistaPagosEstudiantesView>,
    @InjectRepository(VistaPagosPorEstudiante)
    private readonly pagosPorEstudianteRepo: Repository<VistaPagosPorEstudiante>,
    @InjectRepository(VistaCalificacionesCurso)
    private readonly calificacionesCursoRepo: Repository<VistaCalificacionesCurso>,
    @InjectRepository(VistaCalificacionesEstudiante)
    private readonly calificacionesEstudianteRepo: Repository<VistaCalificacionesEstudiante>,
    @InjectRepository(VistaAsistenciasEstudiante)
    private readonly asistenciasEstudianteRepo: Repository<VistaAsistenciasEstudiante>,
    @InjectRepository(VistaAsistenciasCurso)
    private readonly asistenciasCursoRepo: Repository<VistaAsistenciasCurso>,
    @InjectRepository(VistaTutoresCurso)
    private readonly tutoresCursoRepo: Repository<VistaTutoresCurso>,
    @InjectRepository(VistaEstudiantesCurso)
    private readonly estudiantesCursoRepo: Repository<VistaEstudiantesCurso>,
  ) {}

  async buscarPagos(params: {
    idCurso?: number;
    estadoPago?: string;
    mesPago?: number;
    anioPago?: number;
  }) {
    const query = this.pagosViewRepo.createQueryBuilder('v');

    if (params.idCurso) {
      query.andWhere('v.idCurso = :idCurso', { idCurso: params.idCurso });
    }

    if (params.estadoPago) {
      query.andWhere('v.estadoPago = :estado', { estado: params.estadoPago });
    }

    if (params.mesPago) {
      query.andWhere('v.mesPago = :mes', { mes: params.mesPago });
    }

    if (params.anioPago) {
      query.andWhere('v.anioPago = :anio', { anio: params.anioPago });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfPagos(datos: PagoCursoReporte[]): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Pagos por Curso', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 25;

    // 🧾 Cabecera tabla
    const col = {
      nro: 50,
      estudiante: 80,
      curso: 230,
      mes: 320,
      anio: 360,
      total: 410,
      estado: 480,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Estudiante', {
      x: col.estudiante,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('Curso', { x: col.curso, y, size: 10, font: fontBold });
    page.drawText('Mes', { x: col.mes, y, size: 10, font: fontBold });
    page.drawText('Año', { x: col.anio, y, size: 10, font: fontBold });
    page.drawText('Total', { x: col.total, y, size: 10, font: fontBold });
    page.drawText('Estado', { x: col.estado, y, size: 10, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), { x: col.nro, y, size: 9, font });
      page.drawText(d.estudiante, { x: col.estudiante, y, size: 9, font });
      page.drawText(`${d.curso} ${d.paralelo}`, {
        x: col.curso,
        y,
        size: 9,
        font,
      });
      page.drawText(String(d.mesPago), { x: col.mes, y, size: 9, font });
      page.drawText(String(d.anioPago), { x: col.anio, y, size: 9, font });
      page.drawText(`${d.total} Bs`, { x: col.total, y, size: 9, font });
      page.drawText(d.estadoPago, { x: col.estado, y, size: 9, font });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarPagosPorEstudiante(idEstudiante: number) {
    const query = this.pagosPorEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();
    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }
  async generarPdfPagosPorEstudiante(
    datos: PagoPorEstudianteReporte[],
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Pagos por Estudiante', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 25;

    // 🧾 Cabecera tabla
    const colX = {
      nro: 50,
      monto: 220,
      estado: 300,
      fecha: 400,
    };

    page.drawText('N°', { x: colX.nro, y, size: 10, font: fontBold });
    page.drawText('Monto', { x: colX.monto, y, size: 10, font: fontBold });
    page.drawText('Estado', { x: colX.estado, y, size: 10, font: fontBold });
    page.drawText('Fecha', { x: colX.fecha, y, size: 10, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        y = height - 50;
        pdfDoc.addPage();
      }

      page.drawText(String(d.numero), { x: colX.nro, y, size: 9, font });
      page.drawText(`${d.total} Bs`, { x: colX.monto, y, size: 9, font });
      page.drawText(d.estadoPago, { x: colX.estado, y, size: 9, font });
      page.drawText(new Date(d.fecha_creacion).toLocaleDateString(), {
        x: colX.fecha,
        y,
        size: 9,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarCalificacionesPorCurso(params: { idCurso?: number }) {
    const query = this.calificacionesCursoRepo.createQueryBuilder('v');

    if (params.idCurso) {
      query.andWhere('v.idCurso LIKE :idCurso', { idCurso: params.idCurso });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }
  // En reportes.service.ts
  async generarPdfCalificacionesCurso(
    datos: CalificacionReporte[],
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([612, 792]); // tamaño A4
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;

    // 🏫 Encabezado institucional
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Calificaciones por Curso', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= 25;

    // 🧾 Cabecera de tabla
    const colX = {
      nro: 50,
      estudiante: 75,
      materia: 220,
      nota1: 315,
      nota2: 370,
      nota3: 425,
      notaf: 480,
    };

    page.drawText('N°', { x: colX.nro, y, size: 11, font: fontBold });
    page.drawText('Estudiante', {
      x: colX.estudiante,
      y,
      size: 11,
      font: fontBold,
    });
    page.drawText('Materia', { x: colX.materia, y, size: 11, font: fontBold });
    page.drawText('1er Trim.', { x: colX.nota1, y, size: 11, font: fontBold });
    page.drawText('2do Trim.', { x: colX.nota2, y, size: 11, font: fontBold });
    page.drawText('3er Trim.', { x: colX.nota3, y, size: 11, font: fontBold });
    page.drawText('Nota Final', { x: colX.notaf, y, size: 11, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas de la tabla
    for (let i = 0; i < datos.length; i++) {
      const d = datos[i];

      // Salto de página automático
      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }

      page.drawText(String(i + 1), {
        x: colX.nro,
        y,
        size: 10,
        font,
      });

      page.drawText(d.estudiante, {
        x: colX.estudiante,
        y,
        size: 10,
        font,
      });

      page.drawText(d.materia, {
        x: colX.materia,
        y,
        size: 10,
        font,
      });

      page.drawText(String(d.trim1), {
        x: colX.nota1,
        y,
        size: 10,
        font,
      });
      page.drawText(String(d.trim2), {
        x: colX.nota2,
        y,
        size: 10,
        font,
      });
      page.drawText(String(d.trim3), {
        x: colX.nota3,
        y,
        size: 10,
        font,
      });
      page.drawText(String(d.calificacionFinal), {
        x: colX.notaf,
        y,
        size: 10,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarCalificacionesPorEstudiante(idEstudiante: number) {
    const query = this.calificacionesEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfCalificacionesPorEstudiante(
    datos: CalificacionEstudianteReporte[],
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Calificaciones por Estudiante', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 20;

    // 👤 Datos del estudiante (tomamos del primer registro)
    const estudiante = datos[0];

    page.drawText(`Estudiante: ${estudiante.estudiante}`, {
      x: 50,
      y,
      size: 11,
      font,
    });

    y -= 15;

    page.drawText(
      `Curso: ${estudiante.curso} ${estudiante.paralelo} - Gestión ${estudiante.gestion}`,
      {
        x: 50,
        y,
        size: 11,
        font,
      },
    );

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
    });

    y -= 25;

    // 📊 Cabecera tabla
    const col = {
      nro: 50,
      materia: 90,
      trim1: 180,
      trim2: 240,
      trim3: 290,
      calificacionFinal: 350,
      estado: 420,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Materia', { x: col.materia, y, size: 10, font: fontBold });
    page.drawText('1er Trim.', {
      x: col.trim1,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('2er Trim.', {
      x: col.trim2,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('3er Trim.', {
      x: col.trim3,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('Nota Final', {
      x: col.calificacionFinal,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('Estado', { x: col.estado, y, size: 10, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), { x: col.nro, y, size: 9, font });
      page.drawText(d.materia, { x: col.materia, y, size: 9, font });
      page.drawText(String(d.trim1), {
        x: col.trim1,
        y,
        size: 9,
        font,
      });
      page.drawText(String(d.trim2), {
        x: col.trim2,
        y,
        size: 9,
        font,
      });
      page.drawText(String(d.trim3), {
        x: col.trim3,
        y,
        size: 9,
        font,
      });
      page.drawText(String(d.calificacionFinal), {
        x: col.calificacionFinal,
        y,
        size: 9,
        font,
      });
      page.drawText(d.estado, { x: col.estado, y, size: 9, font });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarAsistenciasPorCurso(params: { idCurso?: number; mes?: number }) {
    const query = this.asistenciasCursoRepo.createQueryBuilder('v');

    if (params.idCurso) {
      query.where('v.idCurso = :idCurso', { idCurso: params.idCurso });
      query.andWhere('v.mes = :mes', { mes: params.mes });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfAsistenciasPorCurso(
    datos: AsistenciaCursoReporte[],
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Asistencias por Curso', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 20;

    // 📚 Datos del curso (del primer registro)
    const info = datos[0];

    page.drawText(
      `Curso: ${info.curso} ${info.paralelo} - Gestión ${info.gestion}`,
      {
        x: 50,
        y,
        size: 11,
        font,
      },
    );

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
    });

    y -= 25;

    // 📊 Cabecera tabla
    const col = {
      nro: 50,
      estudiante: 80,
      fecha: 300,
      estado: 400,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Estudiante', {
      x: col.estudiante,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('Fecha', { x: col.fecha, y, size: 10, font: fontBold });
    page.drawText('Asistencia', {
      x: col.estado,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), {
        x: col.nro,
        y,
        size: 9,
        font,
      });

      page.drawText(d.estudiante, {
        x: col.estudiante,
        y,
        size: 9,
        font,
      });

      page.drawText(new Date(d.fecha).toLocaleDateString(), {
        x: col.fecha,
        y,
        size: 9,
        font,
      });

      page.drawText(d.estado_asistencia, {
        x: col.estado,
        y,
        size: 9,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarAsistenciaPorEstudiante(idEstudiante: number) {
    const query = this.asistenciasEstudianteRepo
      .createQueryBuilder('v')
      .where('v.idEstudiante = :id', { id: idEstudiante });

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfAsistenciasPorEstudiante(
    datos: AsistenciaEstudianteReporte[],
  ): Promise<Buffer> {
    if (!datos || datos.length === 0) {
      throw new Error('No existen asistencias para el estudiante');
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado institucional
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Reporte de Asistencias por Estudiante', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 20;

    // 📌 Datos del estudiante
    const info = datos[0];

    page.drawText(`Estudiante: ${info.estudiante}`, {
      x: 50,
      y,
      size: 11,
      font,
    });

    y -= 15;

    page.drawText(
      `Curso: ${info.curso} ${info.paralelo} - Gestión ${info.gestion}`,
      {
        x: 50,
        y,
        size: 11,
        font,
      },
    );

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
    });

    y -= 25;

    // 📊 Cabecera de tabla
    const col = {
      nro: 50,
      fecha: 100,
      estado: 250,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Fecha', { x: col.fecha, y, size: 10, font: fontBold });
    page.drawText('Asistencia', {
      x: col.estado,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), {
        x: col.nro,
        y,
        size: 9,
        font,
      });

      page.drawText(new Date(d.fecha).toLocaleDateString(), {
        x: col.fecha,
        y,
        size: 9,
        font,
      });

      page.drawText(d.estado_asistencia, {
        x: col.estado,
        y,
        size: 9,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;

    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async listarTutores() {
    const resultados = await this.tutoresCursoRepo
      .createQueryBuilder('v')
      .getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfTutoresPorCurso(datos: TutorCursoReporte[]): Promise<Buffer> {
    if (!datos || datos.length === 0) {
      throw new Error('No existen tutores registrados');
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado institucional
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Listado de Tutores por Curso', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 20;

    // 📚 Datos del primer registro (curso)
    const info = datos[0];

    page.drawText(
      `Curso: ${info.curso} ${info.paralelo} - Gestión ${info.gestion}`,
      {
        x: 50,
        y,
        size: 11,
        font,
      },
    );

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
    });

    y -= 25;

    // 📊 Cabecera tabla
    const col = {
      nro: 50,
      tutor: 80,
      telefono: 300,
      correo: 400,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Tutor', { x: col.tutor, y, size: 10, font: fontBold });
    page.drawText('Teléfono', { x: col.telefono, y, size: 10, font: fontBold });
    page.drawText('Correo', { x: col.correo, y, size: 10, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), {
        x: col.nro,
        y,
        size: 9,
        font,
      });

      page.drawText(d.tutor_completo, {
        x: col.tutor,
        y,
        size: 9,
        font,
      });

      page.drawText(d.telefono, {
        x: col.telefono,
        y,
        size: 9,
        font,
      });

      page.drawText(d.correo, {
        x: col.correo,
        y,
        size: 9,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;

    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async buscarEstudiantesPorCurso(params: { idCurso?: number }) {
    const query = this.estudiantesCursoRepo.createQueryBuilder('v');

    if (params.idCurso) {
      query.andWhere('v.idCurso = :idCurso', { idCurso: params.idCurso });
    }

    const resultados = await query.getMany();

    return resultados.map((r, index) => ({
      numero: index + 1,
      ...r,
    }));
  }

  async generarPdfEstudiantesPorCurso(
    datos: EstudianteCursoReporte[],
  ): Promise<Buffer> {
    if (!datos || datos.length === 0) {
      throw new Error('No existen estudiantes para el curso seleccionado');
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // A4
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    // 🏫 Encabezado institucional
    page.drawText('COLEGIO MAYO', {
      x: 50,
      y,
      size: 14,
      font: fontBold,
    });

    y -= 20;

    page.drawText('Listado de Estudiantes por Curso', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
    });

    y -= 20;

    // 📚 Datos del curso
    const info = datos[0];

    page.drawText(
      `Curso: ${info.curso} ${info.paralelo} - Gestión ${info.gestion}`,
      {
        x: 50,
        y,
        size: 11,
        font,
      },
    );

    y -= 15;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
    });

    y -= 25;

    // 📊 Cabecera tabla
    const col = {
      nro: 50,
      estudiante: 80,
      identificacion: 250,
      rude: 330,
      telefono: 420,
    };

    page.drawText('N°', { x: col.nro, y, size: 10, font: fontBold });
    page.drawText('Estudiante', {
      x: col.estudiante,
      y,
      size: 10,
      font: fontBold,
    });
    page.drawText('CI', { x: col.identificacion, y, size: 10, font: fontBold });
    page.drawText('RUDE', { x: col.rude, y, size: 10, font: fontBold });
    page.drawText('Teléfono', { x: col.telefono, y, size: 10, font: fontBold });

    y -= 10;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.8,
    });

    y -= 15;

    // 📄 Filas
    for (const d of datos) {
      if (y < 60) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
      }

      page.drawText(String(d.numero), {
        x: col.nro,
        y,
        size: 9,
        font,
      });

      page.drawText(d.estudiante, {
        x: col.estudiante,
        y,
        size: 9,
        font,
      });

      page.drawText(d.identificacion, {
        x: col.identificacion,
        y,
        size: 9,
        font,
      });

      page.drawText(d.rude, {
        x: col.rude,
        y,
        size: 9,
        font,
      });

      page.drawText(d.telefono_referencia, {
        x: col.telefono,
        y,
        size: 9,
        font,
      });

      y -= 15;
    }

    // 📅 Footer
    y -= 20;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
    });

    y -= 15;

    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y,
      size: 9,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
