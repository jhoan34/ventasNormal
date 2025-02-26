"use client";

import { useEffect, useState } from "react";
import { Producto } from "@prisma/client";


interface PropsU {
    setSelectedProductoId: (productoId: string) => void;
    setGanancia: (ganancia: number) => void;
    setMonto: (monto: number) => void;
    cantidad: number
    productos: Producto[]

}

export const Buscador = ({ cantidad, setSelectedProductoId, setGanancia, setMonto, productos }: PropsU) => {
    const [busqueda, setBusqueda] = useState<string>("");
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);
  
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
        setGanancia((producto.precio - producto.costo) * cantidad);
        setMonto(producto.precio * cantidad);
        setProductosFiltrados([]); // Limpiar los productos filtrados al seleccionar uno
      }
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
          <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {productosFiltrados.map((producto) => (
              <button
                key={producto.id}
                onClick={() => handleProductoChange(producto.id)}
                className="z-[999] hover:text-pink-500 block w-full text-left px-4 py-2 text-white"
              >
                {producto.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
