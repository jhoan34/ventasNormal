"use client";
import { useDatos } from "@/context/usedatos";
import { Producto } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductosDescontinuados() {
  const { productos: datos } = useDatos();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [message, setMessage] = useState<string | number>("");
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    if (datos) {
      const productosDescontinuados = datos.filter(
        (producto) => producto.descontinuo === true
      );
      setProductos(productosDescontinuados);
    }
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
        setMessage("");
      }, 3000);
      setProductos((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      setError(true);
      setMessage(
        error instanceof Error ? error.message : "Error al eliminar producto"
      );
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <section className="p-6 min-h-screen w-[95%]">
      {message && (
        <div
          className={`$${
            error ? "bg-red-600" : "bg-green-600"
          } text-white p-3 rounded-md mb-4`}
        >
          {message}
        </div>
      )}
      <h1 className="text-2xl font-bold text-black mb-6">
        Productos Descontinuados
      </h1>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-black border border-gray-700">
          <thead className="bg-[#EE7890] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 border-2 border-black">ID</th>
              <th className="px-4 py-2 border-2 border-black">Nombre</th>
              <th className="px-4 py-2 border-2 border-black">Precio</th>
              <th className="px-4 py-2 border-2 border-black">Costo</th>
              <th className="px-4 py-2 border-2 border-black">Stock</th>
              <th className="px-4 py-2 border-2 border-black">Imagen</th>
              <th className="px-4 py-2 border-2 border-black">Descontinuado</th>
              <th className="px-4 py-2 border-2 border-black">Creado</th>
              <th className="px-4 py-2 border-2 border-black">Modificado</th>
              <th className="px-4 py-2 border-2 border-black">Ver Ventas</th>
              <th className="px-4 py-2 border-2 border-black">Editar</th>
              <th className="px-4 py-2 border-2 border-black">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto: Producto) => (
              <tr key={producto.id}>
                <td className="px-4 py-2 border-2 border-black">{producto.id}</td>
                <td className="px-4 py-2 border-2 border-black">{producto.nombre}</td>
                <td className="px-4 py-2 border-2 border-black">{producto.precio.toLocaleString("es-co")} COP</td>
                <td className="px-4 py-2 border-2 border-black">{producto.costo.toLocaleString("es-co")} COP</td>
                <td className="px-4 py-2 border-2 border-black">{producto.stock}</td>
                <td className="px-4 py-2 border-2 border-black overflow-auto">
                  <Image
                    width={100}
                    height={100}
                    src={producto.urlImagen}
                    alt={producto.nombre}
                    className="w-24 h-24 object-cover"
                  />
                </td>
                <td className="px-4 py-2 border-2 border-black">{Boolean(producto.descontinuo) ? "Sí" : "No"}</td>
                <td className="px-4 py-2 border-2 border-black">{new Date(producto.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-2 border-black">{new Date(producto.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-2 border-black">
                  <Link href={`/itemVentas/${producto.id}`} className="text-blue-400 hover:underline">
                    Ver Ventas
                  </Link>
                </td>
                <td className="px-4 py-2 border-2 border-black">
                  <Link href={`/editarProducto/${producto.id}`} className="text-yellow-400 hover:underline">
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
