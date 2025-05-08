"use client";

import { useEffect, useState } from "react";
import { Producto } from "@prisma/client";

interface PropsU {
  setSelectedProductoId: (productoId: string) => void;
  productos: Producto[];
}

export const Buscador = ({ setSelectedProductoId, productos }: PropsU) => {
  const [busqueda, setBusqueda] = useState<string>("");
  const [productosFiltrados, setProductosFiltrados] =
    useState<Producto[]>(productos);

  useEffect(() => {
    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductosFiltrados(filtrados);
  }, [busqueda, productos]);

  const handleProductoChange = (productoId: string) => {
    setSelectedProductoId(productoId);
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      setBusqueda(producto.nombre);
    }

    // Delay clearing to allow React to finish state updates
    setTimeout(() => {
      setProductosFiltrados([]);
    }, 0);
  };

  return (
    <div className="relative">
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar producto"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
      />
      {busqueda && productosFiltrados.length > 0 && (
        <div className="absolute z-[10000] mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="w-full p-3 flex flex-col items-center hover:bg-gray-800 cursor-pointer transition duration-150"
              onClick={() => handleProductoChange(producto.id)}
            >
              <p className="text-white text-center text-sm font-medium">
                {producto.nombre}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
