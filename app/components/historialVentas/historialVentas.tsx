"use client";
import { useDatos } from "@/context/usedatos";
import { Venta } from "@prisma/client";
import { useEffect, useState } from "react";

export  function HistorialVentas() {
    const { ventas } = useDatos();
    const [groupedVentas, setGroupedVentas] = useState<
        Record<string, { ventas: Venta[]; total: number; total_cantidad: number; ganancia: number }>
    >({});

    useEffect(() => {
        groupVentasByMonth(ventas);
    }, [ventas]);

    const groupVentasByMonth = (ventas: Venta[]) => {
        const grouped = ventas.reduce(
            (
                acc: Record<string, { ventas: Venta[]; total: number; total_cantidad: number; ganancia: number }>,
                venta
            ) => {
                const date = new Date(venta.updatedAt);
                const monthYear = `${date.toLocaleString("es-co", { month: "long" })} ${date.getFullYear()}`;
                if (acc[monthYear]) {
                    acc[monthYear].ventas.push(venta);
                    acc[monthYear].total += venta.monto;
                    acc[monthYear].total_cantidad += venta.cantidad;
                    acc[monthYear].ganancia += venta.ganancia;
                } else {
                    acc[monthYear] = {
                        ventas: [venta],
                        total: venta.monto,
                        total_cantidad: venta.cantidad,
                        ganancia: venta.ganancia,
                    };
                }
                return acc;
            },
            {}
        );
        setGroupedVentas(grouped);
    };

    return (
        <div className="relative p-6 min-h-screen w-[95%]">
            <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>
            {Object.keys(groupedVentas).length === 0 ? (
                <p className="text-gray-500">No hay ventas registradas.</p>
            ) : (
                Object.entries(groupedVentas).map(([monthYear, group]) => {
                    const { ventas, total, total_cantidad, ganancia } = group;

                    return (
                        <div key={monthYear} className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">{monthYear}</h2>
                            <table className="text-center text-white min-w-full border-collapse border border-gray-200">
                                <thead className="bg-[#EE7890] text-black">
                                    <tr>
                                        <th className="border border-gray-300 p-2">Monto</th>
                                        <th className="border border-gray-300 p-2">Cantidad</th>
                                        <th className="border border-gray-300 p-2">Ganancia</th>
                                        <th className="border border-gray-300 p-2">Fecha</th>
                                        <th className="border border-gray-300 p-2">Mes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.map((venta) => {
                                        const date = new Date(venta.updatedAt);
                                        const monthName = date.toLocaleString("es-co", { month: "long" });

                                        return (
                                            <tr key={venta.id} className="text-center">
                                                <td className="border border-gray-300 p-2">{venta.monto.toLocaleString("es-CO")} COP</td>
                                                <td className="border border-gray-300 p-2">{venta.cantidad}</td>
                                                <td className="border border-gray-300 p-2">{venta.ganancia.toLocaleString("es-CO")} COP</td>
                                                <td className="border border-gray-300 p-2">{date.toLocaleDateString()}</td>
                                                <td className="border border-gray-300 p-2">{monthName}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="min-w-full h-[10vh] flex justify-center gap-x-20 items-center ">
                                <p className="text-white">Total: {total.toLocaleString("es-CO")} COP</p>
                                <p className="text-white">Total Cantidad: {total_cantidad}</p>
                                <p className="text-white">Ganancia: {ganancia.toLocaleString("es-CO")} COP</p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
