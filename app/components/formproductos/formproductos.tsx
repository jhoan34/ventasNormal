"use client";
import { useState} from "react";
import { Producto } from "@prisma/client";

export const FormProductos = () => {
    const [productos, setProductos] = useState<Pick<Producto, "nombre" | "precio" | "costo" | "stock" | "urlImagen">>({
        nombre: '',
        precio: 0,
        costo: 0,
        stock: 0,
        urlImagen: ''
    });    
    const [message, setMessage] = useState<string | number>("");
    const [err, setErr] = useState(false);

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductos({
            ...productos,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (!productos.nombre || !productos.precio || !productos.costo || !productos.stock || !productos.urlImagen) {
                throw new Error("Todos los campos son obligatorios");
            }
            
            const response = await fetch('/api/registrarProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productos)
            })

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Error al registrar producto");
            }

            setErr(false);
            setMessage(data.message);

            setProductos({
                nombre: '',
                precio: 0,
                costo: 0,
                stock: 0,
                urlImagen: ''
            })

            window.location.reload()
        } catch (error) {
            setErr(true);
            setMessage(error instanceof Error ? error.message : "Error al registrar producto");
        }

    }

    return (
        <div className="max-w-md mx-auto p-6 h-full rounded-lg  text-black ">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-white">Nombre del Producto:</label>
                    <input 
                        value={productos.nombre} 
                        onChange={(e) => change(e)} 
                        type="text" 
                        placeholder="Nombre del Producto" 
                        name="nombre" 
                        id="nombre" 
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div>
                    <label htmlFor="precio" className="block text-sm font-medium text-white">Precio del Producto:</label>
                    <input 
                        value={productos.precio} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Precio del Producto" 
                        name="precio" 
                        id="precio" 
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div>
                    <label htmlFor="costo" className="block text-sm font-medium text-white">Costo del Producto:</label>
                    <input 
                        value={productos.costo} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Costo del Producto" 
                        name="costo" 
                        id="costo" 
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-white">Stock del Producto:</label>
                    <input 
                        value={productos.stock} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Stock del Producto" 
                        name="stock" 
                        id="stock" 
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div>
                    <label htmlFor="urlImagen" className="block text-sm font-medium text-white">URL de la Imagen:</label>
                    <input 
                        value={productos.urlImagen} 
                        onChange={(e) => change(e)} 
                        type="text" 
                        placeholder="URL de la Imagen" 
                        name="urlImagen" 
                        id="urlImagen" 
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Registrar Producto
                </button>
                {message && (
                    <p className={`mt-4 text-sm font-medium ${err ? 'text-rose-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
