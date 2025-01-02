"use client"
import { Producto } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDatos } from "@/context/usedatos";

export default function ItemVentas() {
    const [productoFiltrado, setProductoFiltrado] = useState<Producto | undefined>();
    const [productos, setProductos] = useState<Pick<Producto, "nombre" | "precio" | "costo" | "stock" | "urlImagen">>({
        nombre: '',
        precio: 0,
        costo: 0,
        stock: 0,
        urlImagen: ''
    });
    const [message, setMessage] = useState<string | number>("");
    const [err, setErr] = useState(false);
    const [editId, setEditId] = useState<string>("");
    const { productos: data } = useDatos();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname && data) {
            const editId = pathname.split("/").pop();
            if (editId) {
                setEditId(editId);
                const producto = data.find((producto) => producto.id === editId);
                if (producto) {
                    setProductoFiltrado(producto);
                }
            }
        }
    }, [pathname, data]);

    useEffect(() => {
        if (productoFiltrado) {
            setProductos({
                nombre: productoFiltrado.nombre,
                precio: productoFiltrado.precio,
                costo: productoFiltrado.costo,
                stock: productoFiltrado.stock,
                urlImagen: productoFiltrado.urlImagen
            });
        }
    }, [productoFiltrado]);

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductos({
            ...productos,
            [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!productos.nombre || productos.precio <= 0 || productos.costo <= 0 || productos.stock < 0) {
            setErr(true);
            setMessage("Todos los campos son obligatorios y deben tener valores válidos.");
            return;
        }
        try {
            const response = await fetch(`/api/editarProducto/${editId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productos)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrar producto");
            }

            setErr(false);
            setMessage(data.message);
            router.push("/");
        } catch (error) {
            setErr(true);
            setMessage(error instanceof Error ? error.message : "Error al registrar producto");
        }
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center p-6 bg-gradient-to-t from-gray-800 to-gray-950 rounded-lg shadow-lg text-white">
            <form onSubmit={handleSubmit} className="w-[40%] h-[70vh] ">
                <div className="space-y-2">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre del Producto:</label>
                    <input 
                        value={productos.nombre} 
                        onChange={(e) => change(e)} 
                        type="text" 
                        placeholder="Nombre del Producto" 
                        name="nombre" 
                        id="nombre" 
                        className="w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white" 
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="precio" className="block text-sm font-medium text-gray-300">Precio del Producto:</label>
                    <input 
                        value={productos.precio} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Precio del Producto" 
                        name="precio" 
                        id="precio" 
                        className="w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white" 
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="costo" className="block text-sm font-medium text-gray-300">Costo del Producto:</label>
                    <input 
                        value={productos.costo} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Costo del Producto" 
                        name="costo" 
                        id="costo" 
                        className="w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white" 
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Stock del Producto:</label>
                    <input 
                        value={productos.stock} 
                        onChange={(e) => change(e)} 
                        type="number" 
                        placeholder="Stock del Producto" 
                        name="stock" 
                        id="stock" 
                        className="w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white" 
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="urlImagen" className="block text-sm font-medium text-gray-300">URL de la Imagen:</label>
                    <input 
                        value={productos.urlImagen} 
                        onChange={(e) => change(e)} 
                        type="text" 
                        placeholder="URL de la Imagen" 
                        name="urlImagen" 
                        id="urlImagen" 
                        className="w-full px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white" 
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
    );
}
