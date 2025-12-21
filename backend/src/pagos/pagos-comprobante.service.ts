import { Injectable } from '@nestjs/common';
import { Pagos } from './pagos.entity';
import * as PdfMake from 'pdfmake/build/pdfmake';

const pdfFonts = require('pdfmake/build/vfs_fonts');

(PdfMake as any).vfs = pdfFonts.vfs || pdfFonts;

@Injectable()
export class PagosComprobanteService {
  async generar(pago: Pagos): Promise<Buffer> {
    const fechaEmision = new Date().toLocaleString('es-BO');
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 50],
      content: [
        {
          text: 'COMPROBANTE DE PAGO',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            {
              width: '50%',
              text: [
                { text: 'Nº de pago: ', bold: true },
                `${pago.id}\n`,
                { text: 'Estudiante: ', bold: true },
                `${pago.estudiante.nombres} ${pago.estudiante.apellidoPat}\n`,
                { text: 'Mes / Año: ', bold: true },
                `${pago.mes ?? '-'}/${pago.anio}\n`,
                { text: 'Concepto: ', bold: true },
                `${pago.concepto}\n`,
              ],
            },
            {
              width: '50%',
              text: [
                { text: 'Cantidad: ', bold: true },
                `${pago.cantidad}\n`,
                { text: 'Descuento: ', bold: true },
                `${pago.descuento}\n`,
                { text: 'Total pagado: ', bold: true },
                `${pago.total}\n`,
                { text: 'Fecha de pago: ', bold: true },
                `${pago.fecha_pago?.toLocaleString('es-BO') ?? '-'}\n`,
              ],
            },
          ],
        },
        {
          text: `\nComprobante generado: ${fechaEmision}`,
          alignment: 'right',
          italics: true,
          margin: [0, 20, 0, 0],
        },
        {
          text: 'Gracias por su pago.',
          alignment: 'center',
          margin: [0, 30, 0, 0],
        },
      ],
    };

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const pdfDoc = (PdfMake as any).createPdf(docDefinition);
        pdfDoc.getBuffer((buf: Buffer) => resolve(Buffer.from(buf)));
      } catch (err) {
        reject(err);
      }
    });
  }

  async generarAnual(pagos: Pagos[], idPersonal?: number): Promise<Buffer> {
    if (pagos.length === 0) {
      throw new Error('No hay pagos para generar el comprobante anual');
    }

    const fechaEmision = new Date().toLocaleString('es-BO');
    const fechaPago =
      pagos[0].fecha_pago?.toLocaleString('es-BO') || fechaEmision;

    const estudiante = pagos[0].estudiante;
    const cantidadBase = Number(pagos[0].cantidad);
    const descuentoPorMes = Number(pagos[0].descuento);
    const totalPagado = pagos.reduce((sum, p) => sum + Number(p.total), 0);

    const mesesNombre = [
      '',
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Construcción correcta de la tabla
    const tableBody: any[][] = [
      // Header
      [
        { text: 'N°', bold: true, alignment: 'center', fillColor: '#eeeeee' },
        { text: 'Mes / Año', bold: true, fillColor: '#eeeeee' },
        { text: 'Concepto', bold: true, fillColor: '#eeeeee' },
        {
          text: 'Cantidad',
          bold: true,
          alignment: 'right',
          fillColor: '#eeeeee',
        },
        {
          text: 'Descuento',
          bold: true,
          alignment: 'right',
          fillColor: '#eeeeee',
        },
        { text: 'Total', bold: true, alignment: 'right', fillColor: '#eeeeee' },
      ],
    ];

    // Filas de detalle
    pagos.forEach((pago, index) => {
      const mesNombre = mesesNombre[pago.mes as number] || String(pago.mes);
      tableBody.push([
        { text: String(index + 1), alignment: 'center' },
        { text: `${mesNombre} ${pago.anio}`, alignment: 'left' },
        { text: pago.concepto, alignment: 'left' },
        { text: Number(pago.cantidad).toFixed(2), alignment: 'right' },
        { text: Number(pago.descuento).toFixed(2), alignment: 'right' },
        { text: Number(pago.total).toFixed(2), alignment: 'right', bold: true },
      ]);
    });

    // Fila de total (usamos un truco: texto vacío con colSpan en la primera celda)
    tableBody.push([
      {
        text: 'TOTAL PAGADO',
        colSpan: 5,
        bold: true,
        alignment: 'right',
        fillColor: '#dddddd',
      },
      {},
      {},
      {},
      {},
      {
        text: totalPagado.toFixed(2),
        bold: true,
        fontSize: 14,
        alignment: 'right',
        fillColor: '#dddddd',
      },
    ]);

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 80],
      content: [
        {
          text: 'COMPROBANTE DE PAGO ANUAL',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 30],
        },
        {
          columns: [
            {
              width: '60%',
              text: [
                { text: 'Estudiante: ', bold: true },
                `${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat || ''}\n`,
                { text: 'Cantidad base por mensualidad: ', bold: true },
                `${cantidadBase.toFixed(2)}\n`,
                { text: 'Descuento anual aplicado: ', bold: true },
                `10% (${descuentoPorMes.toFixed(2)} por mes)\n`,
                { text: 'Mensualidades pagadas: ', bold: true },
                `${pagos.length}\n`,
                { text: 'Fecha de pago: ', bold: true },
                `${fechaPago}\n`,
              ],
            },
            {
              width: '40%',
              text: [
                { text: 'Total pagado: ', bold: true, fontSize: 16 },
                `${totalPagado.toFixed(2)}\n\n`,
                { text: 'Comprobante generado: ', italics: true },
                `${fechaEmision}`,
              ],
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 30],
        },
        {
          text: 'Detalle de mensualidades pagadas',
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['6%', '20%', '34%', '12%', '12%', '16%'],
            body: tableBody,
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
        },
        {
          text: 'Gracias por su pago.',
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 50, 0, 0],
        },
      ],
      footer: {
        columns: [
          {
            text: 'Sistema de Gestión Escolar - Comprobante oficial',
            alignment: 'center',
            italics: true,
            fontSize: 10,
            margin: [0, 20, 0, 0],
          },
        ],
      },
    };

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const pdfDoc = (PdfMake as any).createPdf(docDefinition);
        pdfDoc.getBuffer((buffer: Buffer) => {
          resolve(Buffer.from(buffer));
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async generarTrimestre(pagos: Pagos[], idPersonal?: number): Promise<Buffer> {
    if (pagos.length !== 3) {
      throw new Error(
        'Se esperaban exactamente 3 pagos para el comprobante trimestral',
      );
    }

    const fechaEmision = new Date().toLocaleString('es-BO');
    const fechaPago =
      pagos[0].fecha_pago?.toLocaleString('es-BO') || fechaEmision;

    const estudiante = pagos[0].estudiante;
    const cantidadBase = Number(pagos[0].cantidad);
    const descuentoPorMes = Number(pagos[0].descuento); // ya calculado (4% / 3)
    const totalPagado = pagos.reduce((sum, p) => sum + Number(p.total), 0);

    const mesesNombre = [
      '',
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const tableBody: any[][] = [
      [
        { text: 'N°', bold: true, alignment: 'center', fillColor: '#eeeeee' },
        { text: 'Mes / Año', bold: true, fillColor: '#eeeeee' },
        { text: 'Concepto', bold: true, fillColor: '#eeeeee' },
        {
          text: 'Cantidad',
          bold: true,
          alignment: 'right',
          fillColor: '#eeeeee',
        },
        {
          text: 'Descuento',
          bold: true,
          alignment: 'right',
          fillColor: '#eeeeee',
        },
        { text: 'Total', bold: true, alignment: 'right', fillColor: '#eeeeee' },
      ],
    ];

    pagos.forEach((pago, index) => {
      const mesNombre = mesesNombre[pago.mes as number] || String(pago.mes);
      tableBody.push([
        { text: String(index + 1), alignment: 'center' },
        { text: `${mesNombre} ${pago.anio}`, alignment: 'left' },
        { text: pago.concepto, alignment: 'left' },
        { text: Number(pago.cantidad).toFixed(2), alignment: 'right' },
        { text: Number(pago.descuento).toFixed(2), alignment: 'right' },
        { text: Number(pago.total).toFixed(2), alignment: 'right', bold: true },
      ]);
    });

    tableBody.push([
      {
        text: 'TOTAL PAGADO',
        colSpan: 5,
        bold: true,
        alignment: 'right',
        fillColor: '#dddddd',
      },
      {},
      {},
      {},
      {},
      {
        text: totalPagado.toFixed(2),
        bold: true,
        fontSize: 14,
        alignment: 'right',
        fillColor: '#dddddd',
      },
    ]);

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 80],
      content: [
        {
          text: 'COMPROBANTE DE PAGO TRIMESTRAL',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 30],
        },
        {
          columns: [
            {
              width: '60%',
              text: [
                { text: 'Estudiante: ', bold: true },
                `${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat || ''}\n`,
                { text: 'Cantidad base por mensualidad: ', bold: true },
                `${cantidadBase.toFixed(2)}\n`,
                { text: 'Descuento trimestral aplicado: ', bold: true },
                `4% (${descuentoPorMes.toFixed(2)} por mes)\n`,
                { text: 'Mensualidades pagadas: ', bold: true },
                '3\n',
                { text: 'Fecha de pago: ', bold: true },
                `${fechaPago}\n`,
              ],
            },
            {
              width: '40%',
              text: [
                { text: 'Total pagado: ', bold: true, fontSize: 16 },
                `${totalPagado.toFixed(2)}\n\n`,
                { text: 'Comprobante generado: ', italics: true },
                `${fechaEmision}`,
              ],
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 30],
        },
        {
          text: 'Detalle de mensualidades pagadas',
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['8%', '25%', '30%', '12%', '12%', '13%'],
            body: tableBody,
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
        },
        {
          text: 'Gracias por su pago.',
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 50, 0, 0],
        },
      ],
      footer: {
        columns: [
          {
            text: 'Sistema de Gestión Escolar - Comprobante oficial',
            alignment: 'center',
            italics: true,
            fontSize: 10,
            margin: [0, 20, 0, 0],
          },
        ],
      },
    };

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const pdfDoc = (PdfMake as any).createPdf(docDefinition);
        pdfDoc.getBuffer((buffer: Buffer) => {
          resolve(Buffer.from(buffer));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
