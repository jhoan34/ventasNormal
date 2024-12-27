import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
    try {
        const id = request.url.split("/").pop(); // Extract the ID from the URL
        if (!id) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        // Verificar si el producto existe
        const producto = await db.producto.findUnique({
            where: { id },
        });

        if (!producto) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        // Eliminar las ventas relacionadas
        await db.venta.deleteMany({
            where: { productoId: id },
        });

        // Eliminar el producto
        await db.producto.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Producto y ventas relacionadas eliminados correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
    }
}
