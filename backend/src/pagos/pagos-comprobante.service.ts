import { Injectable } from '@nestjs/common';
import { Pagos } from './pagos.entity';
import * as PdfMake from 'pdfmake/build/pdfmake';

// ✅ Importar correctamente - el VFS está directamente en el módulo
const pdfFonts = require('pdfmake/build/vfs_fonts');

// ✅ Asignar directamente el vfs (no pdfMake.vfs)
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
}
