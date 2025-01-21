import PDFDocument from 'pdfkit-table';

export function generatePdf(data , datacallback, endCallback) {
    const doc = new PDFDocument({ size: 'A4' });
    doc.on("data", datacallback);
    doc.on("end", endCallback);

    doc.size(40).text("REPORTES FINANCIERO", { align: "center", underline: true });
    doc.table(data, {
        width: 300
    })
    doc.end();
}