import  { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const Url = new URL(request.url).pathname.split("/").pop();
        const { nombre, precio, costo, stock, urlImagen, descontinuo } = body;

        const producto = await db.producto.update({
            where: { id: Url },
            data: {
                nombre,
                precio: parseFloat(precio),
                costo: parseFloat(costo),
                stock: parseInt(stock),
                descontinuo : Boolean(descontinuo),
                urlImagen
            }
        })
        
        if (!producto) {
            return NextResponse.json({ error: "Error al registrar producto" }, { status: 500 });
        }

        return NextResponse.json({ message: "Producto registrado correctamente" });

    } catch (error) {
        console.log(error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error al registrar producto" }, { status: 500 });
    }
}