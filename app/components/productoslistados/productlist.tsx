"use client";
import { useDatos } from "@/context/usedatos";
import { useState, useEffect } from "react";
import { Producto } from "@prisma/client";
import Link from "next/link";

export const ProductsList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { productos: datos} = useDatos();
  const [message, setMessage] = useState<string | number>("");
  const [error, setError] = useState<boolean | null>(null);
  useEffect(() => {
    setProductos(datos);
  }, [datos]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/deleteproducto/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setError(false);
      setMessage("Producto eliminado exitosamente");
      setTimeout(() => {
        setMessage("")
      }, 3000);
      setProductos((prev) => prev.filter((prod) => prod.id !== id))
      
    } catch (error) {
      setError(true);
      setMessage(
        error instanceof Error ? error.message : "Error al registrar producto"
      );
      setTimeout(() => {
        setMessage("")
      }, 3000)
    }
  };

  return (
    <div className="p-6 min-h-screen w-[95%]">
      {message && (
        <div
          className={`${
            error ? "bg-red-600" : "bg-green-600"
          } text-white p-3 rounded-md mb-4`}
        >
          {message}
        </div>
      )}
      <div className="space-y-8">
        {productos.map((producto: Producto) => {
          return (
            <div
              key={producto.id}
              className="p-4 shadow-md rounded-md overflow-auto"
            >
              <h2 className="text-xl font-semibold text-black mb-4">
                {producto.nombre}
              </h2>
              <table className="w-full text-sm text-left text-black border border-gray-700 mb-4">
                <thead className="bg-[#EE7890] text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">ID</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Nombre</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Precio</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Costo</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Stock</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Fecha Creada</th>
                    <th className="px-4 py-5 text-center text-black border-2 border-black">Fecha Modificada</th>

                    <th className="px-4 py-2 border-2 text-black border-black">
                      URL Imagen
                    </th>
                    <th className="px-4 py-2 border-2 text-black border-black">
                      Ver Ventas
                    </th>
                    <th className="px-4 py-2 border-2 text-black border-black">Editar</th>
                    <th className="px-4 py-2 border-2 text-black border-black">
                      Eliminar
                    </th>
                  </tr>
                </thead>
                <tbody className="overflow-auto">
                  <tr>
                    <td className="px-4 py-2 border-2 border-black">
                      {producto.id}
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {producto.precio.toLocaleString("es-co")} COP
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {producto.costo.toLocaleString("es-co")} COP
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {producto.stock}
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {new Date(producto.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      {new Date(producto.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-2 border-black overflow-auto">
                      {producto.urlImagen}
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      <Link
                        href={`/itemVentas/${producto.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        Ver Ventas
                      </Link>
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      <Link
                        href={`/editarProducto/${producto.id}`}
                        className="text-yellow-400 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                    <td className="px-4 py-2 border-2 border-black">
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};
