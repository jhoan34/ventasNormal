import { NextResponse } from "next/server";
import { generatePdf } from "@/pdf.js";

export async function POST(request: Request) {
    try {
        // Obtén los datos del cuerpo de la solicitud
        const body = await request.json();
        const { total_ingresos, total_gastos, ganancias_netas, fecha_mes, fecha_total } = body;

        // Callback para manejar la generación del PDF
        const endCallback = () => {
            // Acción final después de la generación del PDF, si es necesario
        };

        // Datos que se pasarán al generador del PDF
        const data = {
            headers: ["Total Ingresos", "Total Gastos", "Ganancias Netas", "Fecha Mes", "Fecha Total"],
            rows: [
                [total_ingresos, total_gastos, ganancias_netas, fecha_mes, fecha_total]
            ]
        };

        // Usa una promesa para esperar la generación del PDF
        const pdfData = await new Promise<string>((resolve) => {
            // Llamamos a la función generatePdf para generar el PDF
            generatePdf(data, (data: string) => resolve(data), endCallback);
        });

        // Retorna el archivo PDF generado como un stream
        return new NextResponse(pdfData, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=Informe.pdf", // Nombre del archivo PDF
            },
        });
    } catch (error) {
        // Manejo de errores
        console.log(error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error al generar PDF" }, { status: 500 });
    }
}
