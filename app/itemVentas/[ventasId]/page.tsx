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
        // Extrae el ID del producto de la ruta
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

            // Manejo exitoso
            setError(false);
            setMessage(data.message);
            setRelatedVentas((prevVentas) => prevVentas.filter((venta) => venta.id !== id));
        } catch (error) {
            setError(true);
            setMessage(error instanceof Error ? error.message : "Error desconocido al eliminar la venta");
        }
    };

    return (
        <div>
            {relatedVentas.length > 0 ? (
                <>
                    {
                        message && (
                            <p className={`${err ? "text-red-500" : "text-green-700"}`}>{message}</p>
                        )
                    }
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Ventas Relacionadas
                    </h3>
                    <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">ProductoId</th>
                                <th className="px-4 py-2 border">Cantidad</th>
                                <th className="px-4 py-2 border">Monto</th>
                                <th className="px-4 py-2 border">Ganancia</th>
                                <th className="px-4 py-2 border">Eliminar Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatedVentas.map((venta: Venta) => (
                                <tr
                                    key={venta.id}
                                    className="bg-white hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2 border">{venta.id}</td>
                                    <td className="px-4 py-2 border">{venta.productoId}</td>
                                    <td className="px-4 py-2 border">{venta.cantidad}</td>
                                    <td className="px-4 py-2 border">{venta.monto.toLocaleString("es-CO")}COP</td>
                                    <td className="px-4 py-2 border">{venta.ganancia.toLocaleString("es-CO")}COP</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(venta.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-gray-500">No hay ventas relacionadas.</p>
            )}
        </div>
    );
}
