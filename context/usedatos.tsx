"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Producto, Gasto, Venta } from "@prisma/client";

interface DatosContextValue {
    productos: Producto[];
    gastos: Gasto[];
    ventas: Venta[];
}

interface DatosProviderProps {
    children: ReactNode;
}

const DatosContext = createContext<DatosContextValue | null>(null);

export const DatosProvider: React.FC<DatosProviderProps> = ({ children }) => {
    const [datos, setDatos] = useState<DatosContextValue>({ productos: [], gastos: [], ventas: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await fetch("/api/getdatos");
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener datos");
                }
                setDatos(data);
                console.log(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, []);

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <DatosContext.Provider value={datos}>{children}</DatosContext.Provider>;
};

export const useDatos = () => {
    const context = useContext(DatosContext);
    if (!context) {
        throw new Error("useDatos must be used within a DatosProvider");
    }
    return context;
};
