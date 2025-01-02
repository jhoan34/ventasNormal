"use client";
import { useState, useEffect } from "react";
import { Producto } from "@prisma/client";
import type { ChangeEvent } from "react";
import { useDatos } from "@/context/usedatos";

export const FormVentas = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  const [monto, setMonto] = useState<number>(0);
  const [ganancia, setGanancia] = useState<number>(0);
  const [selectedProductoId, setSelectedProductoId] = useState<string>(""); // ID del producto seleccionado
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const { productos: productosBD } = useDatos();

  useEffect(() => {
    if (productosBD.length > 0) {
      setProductos(productosBD);
    }
  }, [productosBD]);

  const handleProductoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const productoId = e.target.value;
    setSelectedProductoId(productoId);

    // Actualizar monto y ganancia basado en el producto seleccionado
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      setGanancia((producto.precio - producto.costo) * cantidad);
      setMonto(producto.precio * cantidad);
    }
  };

  const handleCantidadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cantidadIngresada = parseInt(e.target.value, 10);
    if (isNaN(cantidadIngresada) || cantidadIngresada < 0) {
      setCantidad(0);
      setMonto(0);
      setGanancia(0);
      return;
    }

    setCantidad(cantidadIngresada);

    // Actualizar monto y ganancia basado en el producto seleccionado
    const producto = productos.find((p) => p.id === selectedProductoId);
    if (producto) {
      setMonto(producto.precio * cantidadIngresada);
      setGanancia((producto.precio - producto.costo) * cantidadIngresada);
    }
  };

  const registrarVenta = async () => {
    try {
      // Validaciones previas
      if (!selectedProductoId) {
        throw new Error("Debes seleccionar un producto.");
      }

      const producto = productos.find((p) => p.id === selectedProductoId);
      if (!producto) {
        throw new Error("Producto no encontrado.");
      }

      if (cantidad <= 0) {
        throw new Error("La cantidad debe ser mayor a 0.");
      }

      if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
      }

      // Enviar los datos al backend
      const response = await fetch(`/api/registrarVenta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productoId: selectedProductoId,
          cantidad,
          monto,
          ganancia,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar la venta.");
      }

      // Restablecer el formulario en caso de éxito
      setMessage(data.message || "Venta registrada con éxito.");
      setError(false);
      setCantidad(0);
      setMonto(0);
      setGanancia(0);
      setSelectedProductoId("");
      window.location.reload();
    } catch (error) {
      setError(true);
      setMessage(
        error instanceof Error ? error.message : "Error desconocido al registrar la venta."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 h-full bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Venta</h2>
      <div className="space-y-4 text-gray-950">
        {/* Selector de producto */}
        <div>
          <label htmlFor="producto" className="block text-sm font-medium text-gray-600">
            Producto
          </label>
          <select
            id="producto"
            value={selectedProductoId}
            onChange={handleProductoChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label htmlFor="cantidadVendida" className="block text-sm font-medium text-gray-600">
            Cantidad Vendida
          </label>
          <input
            type="number"
            id="cantidadVendida"
            value={cantidad}
            onChange={handleCantidadChange}
            placeholder="Cantidad Vendida"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Monto y Ganancia */}
        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-gray-600">
            Monto Total
          </label>
          <input
            type="number"
            id="monto"
            value={monto}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ganancia" className="block text-sm font-medium text-gray-600">
            Ganancia Estimada
          </label>
          <input
            type="number"
            id="ganancia"
            value={ganancia}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Botón para registrar la venta */}
      <button
        onClick={registrarVenta}
        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Registrar Venta
      </button>

      {/* Mensajes de éxito o error */}
      {message && (
        <p className={`mt-4 text-sm font-medium ${error ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

