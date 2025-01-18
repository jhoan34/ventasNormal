"use client";
import { useState } from "react";
import { Gasto } from "@prisma/client";

export const FormGastos = () => {
    const [ gasto, setGasto ] = useState<Pick<Gasto, "monto" | "descripcion" >>({
        monto : 0 ,
        descripcion : ""
    });
    const [ message, setMessage ] = useState<string | number>("");
    const [ err, setErr ] = useState(false);

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGasto({
            ...gasto,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/registrarGasto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gasto)

            })
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrar gasto");
            }

            setErr(false);
            setMessage(data.message);

            setGasto({
                monto : 0,
                descripcion : ""
            })
            window.location.reload()
        } catch (error) {
            setErr(true);
            setMessage(error instanceof Error ? error.message : "Error desconocido");
        }
    }

    return (
        <div className="max-w-md mx-auto h-full p-6 rounded-lg ">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="monto" className="block text-sm font-medium text-white">Monto:</label>
                    <input 
                        type="number" 
                        id="monto" 
                        name="monto" 
                        value={gasto.monto} 
                        onChange={change} 
                        className="mt-1 block w-full px-4 py-2 border text-white bg-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required 
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-white">Descripción:</label>
                    <input 
                        type="text" 
                        id="descripcion" 
                        name="descripcion" 
                        value={gasto.descripcion} 
                        onChange={change} 
                        className="mt-1 block w-full px-4 py-2 border text-white bg-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Guardar Gasto
                </button>
                {message && (
                    <p className={`mt-4 text-sm font-medium ${err ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>


    )
}