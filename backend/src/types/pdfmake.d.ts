declare module 'pdfmake' {
  interface Fonts {
    [key: string]: {
      normal: string;
      bold?: string;
      italics?: string;
      bolditalics?: string;
    };
  }

  interface PdfKitDocument {
    on(event: 'data' | 'end' | 'error', listener: (chunk?: any) => void): this;
    end(): void;
  }

  interface DocDefinition {
    content: any[];
    styles?: { [key: string]: any };
  }

  class PdfPrinter {
    constructor(fonts: Fonts);
    createPdfKitDocument(docDefinition: DocDefinition): PdfKitDocument;
  }

  export default PdfPrinter;
}
