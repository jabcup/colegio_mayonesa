import { Injectable, BadRequestException } from '@nestjs/common';
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
          margin: [0, 0, 0, 20] 
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
          margin: [0, 20, 0, 0] 
        },
        { 
          text: 'Gracias por su pago.', 
          alignment: 'center', 
          margin: [0, 30, 0, 0] 
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

  async generarMultiple(pagos: Pagos[]): Promise<Buffer> {
    if (pagos.length === 0) {
      throw new BadRequestException('No hay pagos para generar el comprobante');
    }

    const primerPago = pagos[0];
    const estudiante = primerPago.estudiante;
    const fechaEmision = new Date().toLocaleString('es-BO');

    const subtotal = pagos.reduce((sum, p) => sum + Number(p.cantidad), 0);
    const descuentoTotal = pagos.reduce((sum, p) => sum + Number(p.descuento), 0);
    const total = pagos.reduce((sum, p) => sum + Number(p.total), 0);

    const tipoPago = pagos.length === 3 ? 'TRIMESTRAL' : 
                     pagos.length === 10 ? 'ANUAL' : 'MÚLTIPLE';

    const detallesPagos = pagos.map((pago, index) => ({
      text: [
        { text: `${index + 1}. `, bold: true },
        `${pago.concepto} (${pago.mes ?? '-'}/${pago.anio}) - Bs. ${Number(pago.cantidad).toFixed(2)}\n`
      ],
      margin: [0, 2, 0, 2]
    }));

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 50],
      content: [
        { 
          text: 'COMPROBANTE DE PAGO', 
          fontSize: 18, 
          bold: true, 
          alignment: 'center', 
          margin: [0, 0, 0, 10] 
        },
        { 
          text: `Tipo: ${tipoPago}`, 
          fontSize: 12, 
          alignment: 'center', 
          margin: [0, 0, 0, 20] 
        },
        {
          text: [
            { text: 'Estudiante: ', bold: true },
            `${estudiante.nombres} ${estudiante.apellidoPat} ${estudiante.apellidoMat}\n`,
            { text: 'CI: ', bold: true },
            `${estudiante.identificacion}\n`,
            { text: 'Fecha de pago: ', bold: true },
            `${primerPago.fecha_pago?.toLocaleString('es-BO') ?? fechaEmision}\n`,
          ],
          margin: [0, 0, 0, 15]
        },
        {
          text: 'Detalle de Pagos:',
          bold: true,
          fontSize: 12,
          margin: [0, 10, 0, 10]
        },
        ...detallesPagos,
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
          ],
          margin: [0, 15, 0, 15]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              text: [
                { text: 'Subtotal: ', bold: true },
                `Bs. ${subtotal.toFixed(2)}\n`,
                { text: 'Descuento: ', bold: true },
                `Bs. ${descuentoTotal.toFixed(2)}\n`,
                { text: 'TOTAL: ', bold: true, fontSize: 14 },
                { text: `Bs. ${total.toFixed(2)}`, bold: true, fontSize: 14 }
              ]
            }
          ]
        },
        { 
          text: `\nComprobante generado: ${fechaEmision}`, 
          alignment: 'right', 
          italics: true, 
          margin: [0, 20, 0, 0] 
        },
        { 
          text: 'Gracias por su pago.', 
          alignment: 'center', 
          margin: [0, 30, 0, 0] 
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
}
