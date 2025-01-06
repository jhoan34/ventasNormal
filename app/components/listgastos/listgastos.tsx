"use client";
import { useEffect, useState } from "react";
import { Gasto } from "@prisma/client";
import { useDatos } from "@/context/usedatos";


export const ListGastos = () => {
  const [gastosPrime, setGastoPrime] = useState<Gasto[]>([]);
  const [message, setMessage] = useState<string | number>("");
  const [err, setErr] = useState(false);
  const { gastos } = useDatos();

  useEffect(() => {
    if (gastos && gastos.length > 0) {
      setGastoPrime(gastos);
    }
  }, [gastos]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/deletegasto/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar gasto");
      }

      setErr(false);
      setMessage(data.message);
      setTimeout(() => {
        setMessage("")
      }, 3000);
      setGastoPrime((prev) => prev.filter((gasto) => gasto.id !== id));
    } catch (error) {
      setErr(true);
      setMessage(error instanceof Error ? error.message : "Error desconocido");
      setTimeout(() => {
        setMessage("")
      }, 3000);
    }
  };

  return (
    <div className=" bg-black min-h-screen w-full p-20">
      <h1 className="text-2xl text-white font-bold mb-6">Lista de Gastos</h1>
      {message && (
        <div
          className={`${
            err ? "bg-red-600" : "bg-green-600"
          } text-white p-3 rounded-md mb-4`}
        >
          {message}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-black text-gray-300">
            <tr className="border-2 border-gray-600">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Fecha Creada</th>
              <th className="px-6 py-3">Fecha Modificada</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastosPrime.map((gasto: Gasto) => (
              <tr
                key={gasto.id}
                className="border-2 bg-black border-gray-600 hover:bg-gray-600"
              >
                <td className="px-6 py-4">{gasto.id}</td>
                <td className="px-6 py-4">{gasto.monto.toLocaleString("es-CO")} COP</td>
                <td className="px-6 py-4">{gasto.descripcion}</td>
                <th className="px-6 py-4">{new Date(gasto.createdAt).toLocaleDateString() }</th>
                <th className="px-6 py-4">{new Date(gasto.updatedAt).toLocaleDateString()}</th>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(gasto.id)}
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
    </div>
  );
};
