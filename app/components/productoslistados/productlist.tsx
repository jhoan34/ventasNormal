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
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Productos</h1>
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
              className="p-4 bg-gray-800 shadow-md rounded-md overflow-auto"
            >
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                {producto.nombre}
              </h2>
              <table className="w-full text-sm text-left text-gray-400 border border-gray-700 mb-4">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2 border border-gray-600">ID</th>
                    <th className="px-4 py-2 border border-gray-600">Nombre</th>
                    <th className="px-4 py-2 border border-gray-600">Precio</th>
                    <th className="px-4 py-2 border border-gray-600">Costo</th>
                    <th className="px-4 py-2 border border-gray-600">Stock</th>
                    <th className="px-4 py-2 border border-gray-600">Fecha Creada</th>
                    <th className="px-4 py-2 border border-gray-600">Fecha Modificada</th>

                    <th className="px-4 py-2 border border-gray-600">
                      URL Imagen
                    </th>
                    <th className="px-4 py-2 border border-gray-600">
                      Ver Ventas
                    </th>
                    <th className="px-4 py-2 border border-gray-600">Editar</th>
                    <th className="px-4 py-2 border border-gray-600">
                      Eliminar
                    </th>
                  </tr>
                </thead>
                <tbody className="overflow-auto">
                  <tr className="bg-gray-800 hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-600">
                      {producto.id}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {producto.precio.toLocaleString("es-co")} COP
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {producto.costo.toLocaleString("es-co")} COP
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {producto.stock}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {new Date(producto.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      {new Date(producto.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-600 overflow-auto">
                      {producto.urlImagen}
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      <Link
                        href={`/itemVentas/${producto.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        Ver Ventas
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
                      <Link
                        href={`/editarProducto/${producto.id}`}
                        className="text-yellow-400 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-gray-600">
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
