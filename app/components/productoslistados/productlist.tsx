"use client";
import { useDatos } from "@/context/usedatos";
import { useState, useEffect } from "react";
import { Producto } from "@prisma/client";
import Link from "next/link";

export const ProductsList = () => {
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const { productos: datos } = useDatos();
  const [message, setMessage] = useState<string | number>("");
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    setProductosFiltrados(datos);
  }, [datos]);

  useEffect(() => {
    const filteredProducts = datos.filter((prod) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductosFiltrados(filteredProducts);
  }, [busqueda, datos]); // Se debe filtrar a partir de `datos`, no de `productosFiltrados`

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
      setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      setError(true);
      setMessage(
        error instanceof Error ? error.message : "Error al registrar producto"
      );
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleContinuar = async (id: string) => {
    try {
      const response = await fetch(`/api/updateproduct/${id}`, {
        method: "PUT",
        body: JSON.stringify({ descontinuo: true }),
      });

      if (!response.ok) {
        throw new Error("Error al continuar el producto");
      }

      setError(false);
      setMessage("Producto continuado exitosamente");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setProductosFiltrados((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      setError(true);
      setMessage(
        error instanceof Error ? error.message : "Error al continuar producto"
      );
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="relative p-6 min-h-screen w-[95%]">
      <div className="ml-4 mb-4 bg-black flex flex-col w-[90%] p-5 rounded-lg shadow-lg">
        <label htmlFor="busqueda" className="text-white font-serif font-bold text-lg">Busqueda</label>
        <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto" />
      </div>
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
        {productosFiltrados
          .filter((prod) => Boolean(prod.descontinuo) === false)
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
          .map((producto: Producto) => {
            return (
              <div
                key={producto.id}
                className="p-4 shadow-md rounded-md overflow-auto"
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {producto.nombre}
                </h2>
                <table className="w-full text-sm text-left text-white border border-white mb-4 table-auto">
                  <thead className="bg-[#EE7890] text-gray-300 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Nombre
                      </th>
                      <th className="px-4 py-2 border-2 text-white border-white">
                        URL Imagen
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Precio
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Costo
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Stock
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Descontinuo
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Fecha Creada
                      </th>
                      <th className="px-4 py-5 text-center text-white border-2 border-white">
                        Fecha Modificada
                      </th>
                      <th className="px-4 py-2 border-2 text-white border-white">
                        Ver Ventas
                      </th>
                      <th className="px-4 py-2 border-2 text-white border-white">
                        Editar
                      </th>
                      <th className="px-4 py-2 border-2 text-white border-white">
                        Eliminar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-auto">
                    <tr>
                      <td className="px-4 py-2 border-2 border-white">
                        {producto.nombre}
                      </td>
                      <td className="min-w-[200px] h-36 px-4 py-2 border-2 border-white overflow-auto">
                        <img
                          src={producto.urlImagen}
                          alt={producto.nombre}
                          className="w-full h-36 object-cover"
                        />
                      </td>


                      <td className="px-4 py-2 border-2 border-white">
                        {producto.precio.toLocaleString("es-co")} COP
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        {producto.costo.toLocaleString("es-co")} COP
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        {producto.stock}
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        <label>
                          {Boolean(producto.descontinuo)
                            ? "Descontinuado"
                            : "Activo"}
                        </label>{" "}
                        <button className="p-2 bg-[#EE7890] hover:bg-[#EE7890]/80" onClick={() => handleContinuar(producto.id)}>
                          descontinuar
                        </button>
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        {new Date(producto.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        {new Date(producto.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        <Link
                          href={`/itemVentas/${producto.id}`}
                          className="text-blue-400 hover:underline"
                        >
                          Ver Ventas
                        </Link>
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
                        <Link
                          href={`/editarProducto/${producto.id}`}
                          className="text-yellow-400 hover:underline"
                        >
                          Editar
                        </Link>
                      </td>
                      <td className="px-4 py-2 border-2 border-white">
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
