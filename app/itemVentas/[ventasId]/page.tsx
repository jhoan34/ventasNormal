"use client";
import { useDatos } from "@/context/usedatos";
import { Venta } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemVentas() {
    const pathna = usePathname();
    const [message, setMessage] = useState<string | number>("");
    const [err, setError] = useState(false);
    const [relatedVentas, setRelatedVentas] = useState<Venta[]>([]);
    const { ventas } = useDatos();

    useEffect(() => {
        const productoId = pathna.split("/").pop();

        if (productoId) {
            const related = ventas.filter(
                (venta: Venta) => venta.productoId === productoId
            );
            setRelatedVentas(related);
        }
    }, [ventas, pathna]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/deleteventa/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar venta");
            }

            const data = await response.json();

            setError(false);
            setMessage(data.message);
            setRelatedVentas((prevVentas) => prevVentas.filter((venta) => venta.id !== id));
        } catch (error) {
            setError(true);
            setMessage(error instanceof Error ? error.message : "Error desconocido al eliminar la venta");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-950 flex flex-col p-8">
            {message && (
                <p className={`text-lg font-semibold mb-6 ${err ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </p>
            )}
            <h3 className="text-2xl text-center font-bold text-white mb-8">
                Ventas Relacionadas
            </h3>
            {relatedVentas.length > 0 ? (
                <div className="w-full">
                    <table className="w-full text-base text-left text-white border border-white shadow-md rounded-md">
                        <thead className="bg-[#EE7890] text-white uppercase font-semibold">
                            <tr>                                <th className="px-6 py-4 border border-white">Cantidad</th>
                                <th className="px-6 py-4 border border-white">Monto</th>
                                <th className="px-6 py-4 border border-white">Ganancia</th>
                                <th className="px-6 py-4 border border-white">Fecha creada</th>
                                <th className="px-6 py-4 border border-white">Fecha Modificada</th>
                                <th className="px-6 py-4 border border-white">Eliminar Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatedVentas.map((venta: Venta) => (
                                <tr
                                    key={venta.id}
                                    className="hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 border border-white">{venta.cantidad}</td>
                                    <td className="px-6 py-4 border border-white">{venta.monto.toLocaleString("es-CO")} COP</td>
                                    <td className="px-6 py-4 border border-white">{venta.ganancia.toLocaleString("es-CO")} COP</td>
                                    <td className="px-6 py-4 border border-white">{new Date(venta.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border border-white">{new Date(venta.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border border-white">
                                        <button
                                            onClick={() => handleDelete(venta.id)}
                                            className="text-red-500 font-medium hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-lg text-gray-500">No hay ventas relacionadas.</p>
            )}
        </div>
    );
}
