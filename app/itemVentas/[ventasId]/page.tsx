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
        <div className="min-h-screen w-full bg-black flex flex-col  p-8">
            {message && (
                <p className={`text-lg font-semibold mb-6 ${err ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </p>
            )}
            <h3 className="text-2xl text-center font-bold text-white mb-8">
                Ventas Relacionadas
            </h3>
            {relatedVentas.length > 0 ? (
                <div className="w-full ">
                    <table className="w-full text-base text-left bg-white text-gray-700 border border-gray-300 shadow-md rounded-md">
                        <thead className="bg-pink-200 text-gray-800 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 border border-gray-300">ID</th>
                                <th className="px-6 py-4 border border-gray-300">ProductoId</th>
                                <th className="px-6 py-4 border border-gray-300">Cantidad</th>
                                <th className="px-6 py-4 border border-gray-300">Monto</th>
                                <th className="px-6 py-4 border border-gray-300">Ganancia</th>
                                <th className="px-6 py-4 border border-gray-300">Fecha creada</th>
                                <th className="px-6 py-4 border border-gray-300">Fecha Modificada</th>
                                <th className="px-6 py-4 border border-gray-300">Eliminar Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatedVentas.map((venta: Venta) => (
                                <tr
                                    key={venta.id}
                                    className="hover:bg-gray-100"
                                >
                                    <td className="px-6 py-4 border border-gray-300">{venta.id}</td>
                                    <td className="px-6 py-4 border border-gray-300">{venta.productoId}</td>
                                    <td className="px-6 py-4 border border-gray-300">{venta.cantidad}</td>
                                    <td className="px-6 py-4 border border-gray-300">{venta.monto.toLocaleString("es-CO")} COP</td>
                                    <td className="px-6 py-4 border border-gray-300">{venta.ganancia.toLocaleString("es-CO")} COP</td>
                                    <td className="px-6 py-4 border border-gray-300">{new Date(venta.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border border-gray-300">{new Date(venta.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 border border-gray-300">
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
