"use client";
import { useState, useEffect } from "react";
import { Producto, Gasto, Venta } from "@prisma/client";
import { useDatos } from "@/context/usedatos";

export const ReporteFinanciero = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const { productos: datosProductos, gastos: datosGastos, ventas: datosVentas } = useDatos();

    useEffect(() => {
        if (datosProductos && datosGastos && datosVentas) {
            setProductos(datosProductos);
            setGastos(datosGastos);
            setVentas(datosVentas);
        }
    }, [datosProductos, datosGastos, datosVentas]);

    // Calcular totales
    const totalIngresos = ventas.reduce((sum, venta) => sum + venta.monto, 0);
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const totalCostos = ventas.reduce((sum, venta) => {
        const producto = productos.find((p) => p.id === venta.productoId);
        return sum + (producto?.costo || 0) * venta.cantidad;
    }, 0);
    const gananciasNetas = totalIngresos - totalCostos - totalGastos;

    // Producto más vendido
    const productoMasVendido = ventas.reduce((acc, venta) => {
        acc[venta.productoId] = (acc[venta.productoId] || 0) + venta.cantidad;
        return acc;
    }, {} as Record<string, number>);

    const masVendidoId = Object.keys(productoMasVendido).reduce((a, b) =>
        productoMasVendido[a] > productoMasVendido[b] ? a : b
    , "");

    const productoMasVendidoNombre = productos.find((p) => p.id === masVendidoId)?.nombre || "No disponible";

    // Gasto más alto
    const gastoMasAlto = gastos.reduce((max, gasto) => (gasto.monto > max ? gasto.monto : max), 0);
    const gastoMasAltoDescripcion = gastos.find((g) => g.monto === gastoMasAlto)?.descripcion || "No disponible";

    return (
        <div className="p-6 w-[90%] min-h-screen bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-[#EE7890] text-black rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Ingresos</h2>
                    <p className="text-2xl font-bold">{totalIngresos.toLocaleString("es-CO")} COP</p>
                </div>
                <div className="p-4 bg-[#EE7890] text-black rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Gastos</h2>
                    <p className="text-2xl font-bold">{totalGastos.toLocaleString("es-CO")} COP</p>
                </div>
                <div className={`p-4 text-black ${gananciasNetas >= 0 ? "bg-[#EE7890]" : "bg-red-800"} rounded-md shadow-md`}>
                    <h2 className="text-xl font-semibold mb-2">Ganancias Netas</h2>
                    <p className="text-2xl font-bold">{gananciasNetas.toLocaleString("es-CO")} COP</p>
                </div>
                <div className="p-4 bg-[#EE7890] text-black rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Producto Más Vendido</h2>
                    <p className="text-lg">{productoMasVendidoNombre}</p>
                </div>
                <div className="p-4 bg-[#EE7890] text-black rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Gasto Más Alto</h2>
                    <p className="text-lg">{gastoMasAltoDescripcion}</p>
                    <p className="text-2xl font-bold">{gastoMasAlto.toLocaleString("es-CO")} COP</p>
                </div>
            </div>

            <div className="p-6 rounded-md shadow-md mb-8 text-black ">
                <h2 className="text-2xl font-semibold mb-4">Detalles de Ventas</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left text-sm">
                        <thead className="bg-[#EE7890]">
                            <tr>
                                <th className="px-5 py-4 border-2 border-black">ID</th>
                                <th className="px-5 py-4 border-2 border-black">Producto</th>
                                <th className="px-5 py-4 border-2 border-black">Cantidad</th>
                                <th className="px-5 py-4 border-2 border-black">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta) => (
                                <tr key={venta.id}>
                                    <td className="px-5 border-2 border-black py-2">{venta.id}</td>
                                    <td className="px-5 border-2 border-black py-2">
                                        {productos.find((p) => p.id === venta.productoId)?.nombre || "No disponible"}
                                    </td>
                                    <td className="px-5 border-2 border-black py-2">{venta.cantidad}</td>
                                    <td className="px-5 border-2 border-black py-2">{venta.monto.toLocaleString("es-CO")} COP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-6 rounded-md shadow-md text-black">
                <h2 className="text-2xl font-semibold mb-4">Detalles de Gastos</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left text-sm">
                        <thead className="bg-[#EE7890]">
                            <tr>
                                <th className="px-4 py-2 border-2 border-black">ID</th>
                                <th className="px-4 py-2 border-2 border-black">Descripción</th>
                                <th className="px-4 py-2 border-2 border-black">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gastos.map((gasto) => (
                                <tr key={gasto.id}>
                                    <td className="px-4 border-2 border-black py-2">{gasto.id}</td>
                                    <td className="px-4 border-2 border-black py-2">{gasto.descripcion}</td>
                                    <td className="px-4 border-2 border-black py-2">-{gasto.monto.toLocaleString("es-CO")} COP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
