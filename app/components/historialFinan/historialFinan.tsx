"use client";
import { useDatos } from "@/context/usedatos";
import { Venta, Gasto } from "@prisma/client";

// Definimos los tipos para las variables y la estructura de los datos
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

export function HistorialFinan() {
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

    return (
        <div className="p-6 w-[90%] min-h-screen">
            <table className="min-w-full text-white table-auto border-collapse border border-gray-300">
                <thead className="bg-[#EE7890]"> 
                    <tr>
                        <th className="border px-4 py-2 text-left">Mes</th>
                        <th className="border px-4 py-2 text-left">Total Ventas</th>
                        <th className="border px-4 py-2 text-left">Cantidad Vendida</th>
                        <th className="border px-4 py-2 text-left">Costo de Producto</th>
                        <th className="border px-4 py-2 text-left">Ganancia</th>
                        <th className="border px-4 py-2 text-left">Gastos</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(ventasCalculo).map(([monthYear, data]) => (
                        <tr key={monthYear}>
                            <td className="border px-4 py-2">{monthYear}</td>
                            <td className="border px-4 py-2">{data.total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                            <td className="border px-4 py-2">{data.total_cantidad}</td>
                            <td className="border px-4 py-2">{data.producto_costo.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                            <td className="border px-4 py-2">{data.total_ganancia.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                            <td className="border px-4 py-2">{data.total_gastos.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
