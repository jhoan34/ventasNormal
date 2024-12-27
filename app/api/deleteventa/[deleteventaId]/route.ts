import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
    try {
        const id = request.url.split("/").pop(); // Extract the ID from the URL
        if (!id) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        // Verificar si la venta existe
        const venta = await db.venta.findUnique({
            where: { id },
        });

        if (!venta) {
            return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
        }

        // Eliminar la venta
        await db.venta.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Venta eliminada correctamente" });

    } catch (error) {
        console.error("Error al eliminar venta:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 });
    }
}