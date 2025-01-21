"use client";
import { useDatos } from "@/context/usedatos";
import { Venta, Producto, Gasto } from "@prisma/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
interface GastoAcumulado {
    gastos: Gasto[];
    total: number;
}

interface VentasCalculo {
    ventas: Venta[];
    total: number;
    total_cantidad: number;
    producto_costo: number;
    total_ganancia: number;
    total_gastos: number;
}


export function GeneratePdf () {
    const { productos: datosProductos, gastos: datosGastos, ventas: datosVentas } = useDatos();
    
    const ventasCalculo = datosVentas.reduce<{ [key: string]: VentasCalculo }>((acc, venta) => {
        const date = new Date(venta.updatedAt);
        const monthYear = `${date.toLocaleString("es-co", { month: "long" })} ${date.getFullYear()}`;
        const producto = datosProductos.find((p) => p.id === venta.productoId);

        // Manejo de gastos
        const gastosAcumulados = datosGastos.reduce<{ [key: string]: GastoAcumulado }>((gAcc, gasto) => {
            const gastoDate = new Date(gasto.updatedAt);
            const gastoMonthYear = `${gastoDate.toLocaleString("es-co", { month: "long" })} ${gastoDate.getFullYear()}`;
            if (gAcc[gastoMonthYear]) {
                gAcc[gastoMonthYear].gastos.push(gasto);
                gAcc[gastoMonthYear].total += gasto.monto;
            } else {
                gAcc[gastoMonthYear] = {
                    gastos: [gasto],
                    total: gasto.monto,
                };
            }
            return gAcc;
        }, {});

        // Actualización de ventas
        if (acc[monthYear]) {
            acc[monthYear].ventas.push(venta);
            acc[monthYear].total += venta.monto;
            acc[monthYear].total_cantidad += venta.cantidad;
            acc[monthYear].producto_costo += (producto?.costo || 0) * venta.cantidad;
            acc[monthYear].total_ganancia += venta.monto - ((producto?.costo || 0) * venta.cantidad);
        } else {
            acc[monthYear] = {
                ventas: [venta],
                total: venta.monto,
                total_cantidad: venta.cantidad,
                producto_costo: (producto?.costo || 0) * venta.cantidad,
                total_ganancia: venta.monto - ((producto?.costo || 0) * venta.cantidad),
                total_gastos: gastosAcumulados[monthYear]?.total || 0,
            };
        }
        return acc;
    }, {});

    
    const productosPorMes = Object.entries(datosProductos.reduce<Record<string, Producto[]>>(
        (acc, producto: Producto) => {
            const date = new Date(producto.updatedAt);
            const monthYear = `${date.toLocaleString("es-co", { month: "long" })}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(producto);
            return acc;
        },
        {}
    ));

    const gastosPorMes = Object.entries(datosGastos.reduce<Record<string, Gasto[]>>(
        (acc, gasto: Gasto) => {
            const date = new Date(gasto.updatedAt);
            const monthYear = `${date.toLocaleString("es-co", { month: "long" })}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(gasto);
            return acc;
        },
        {}
    ));

    const ventasPorMes = Object.entries(datosVentas.reduce<Record<string, Venta[]>>(
        (acc, venta: Venta) => {
            const date = new Date(venta.updatedAt);
            const monthYear = `${date.toLocaleString("es-co", { month: "long" })}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(venta);
            return acc;
        },
        {}
    ));

    const pdfSubmit = async () => {
        const doc = new jsPDF();
        const margin = 14;
    
        // Títulos en la primera hoja
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte Financiero", margin, 20);
    
        // Información general en la primera hoja
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, margin, 30);
    
        // Resumen financiero en la primera hoja
        let currentY = 40;
        doc.setFontSize(14);
        doc.text("Resumen Financiero", margin, currentY);
        currentY += 10;
    
        autoTable(doc, {
            startY: currentY,
            head: [["Mes", "Total Ventas", "Cantidad Vendida", "Costo Producto", "Ganancias Netas sin Gastos", "Gastos"]],
            body: Object.entries(ventasCalculo).map(([monthYear, data]) => [
                monthYear,
                data.total.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
                data.total_cantidad,
                data.producto_costo.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
                data.total_ganancia.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
                data.total_gastos.toLocaleString("es-CO", { style: "currency", currency: "COP" })
            ]),
            theme: "grid",
            styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
    
        // Nueva hoja para "Productos por Mes"
        doc.addPage();
        currentY = 20; // Reinicia la posición vertical
        doc.setFontSize(14);
        doc.text("Productos por Mes", margin, currentY);
        currentY += 10;
    
        autoTable(doc, {
            startY: currentY,
            head: [["Producto", "Precio", "Stock", "Mes"]],
            body: productosPorMes.flatMap(([month, productos]) =>
                productos.map((producto) => [
                    producto.nombre,
                    producto.precio.toLocaleString("es-CO") + " COP",
                    producto.stock,
                    month,
                ])
            ),
            theme: "grid",
            styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
    
        // Nueva hoja para "Gastos por Mes"
        doc.addPage();
        currentY = 20;
        doc.setFontSize(14);
        doc.text("Gastos por Mes", margin, currentY);
        currentY += 10;
    
        autoTable(doc, {
            startY: currentY,
            head: [["Descripción", "Monto", "Mes"]],
            body: gastosPorMes.flatMap(([month, gastos]) =>
                gastos.map((gasto) => [
                    gasto.descripcion,
                    gasto.monto.toLocaleString("es-CO") + " COP",
                    month,
                ])
            ),
            theme: "grid",
            styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
    
        // Nueva hoja para "Ventas por Mes"
        doc.addPage();
        currentY = 20;
        doc.setFontSize(14);
        doc.text("Ventas por Mes", margin, currentY);
        currentY += 10;
    
        autoTable(doc, {
            startY: currentY,
            head: [["Producto", "Cantidad", "Monto", "Ganancia", "Mes"]],
            body: ventasPorMes.flatMap(([month, ventas]) =>
                ventas.map((venta) => [
                    datosProductos.find((p) => p.id === venta.productoId)?.nombre || "Desconocido",
                    venta.cantidad,
                    venta.monto.toLocaleString("es-CO") + " COP",
                    venta.ganancia.toLocaleString("es-CO") + " COP",
                    month,
                ])
            ),
            theme: "grid",
            styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
    
        // Guardar PDF
        doc.save("reporte_financiero.pdf");
    };
    
    
    return (
        <button onClick={pdfSubmit} className="bg-[#EE7890] text-white px-4 py-2  hover:bg-[#bd5167] absolute left-1 top-1"> Generar PDF de historial pdf</button>
    )
}