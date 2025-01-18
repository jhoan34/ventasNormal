import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
    try {
        const id = request.url.split("/").pop(); // Extract the ID from the URL
        if (!id) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        const body = await request.json();
        const {descontinuo } = body;
        
        const update = await db.producto.update ({
            where: { id },
            data: {
                descontinuo: Boolean(descontinuo)
            }
        });

        if (!update) {
            return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
        }

        return NextResponse.json({ message: "Producto actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar producto:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
    }
        
}