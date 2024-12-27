import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function DELETE(request: Request) {
    try {
        const id = new URL(request.url).pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        // Verificar si el producto existe
        const gasto = await db.gasto.findUnique({
            where: { id },
        });

        if (!gasto) {
            return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 });
        }
        
        // Eliminar el producto
        await db.gasto.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar gasto:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Error al eliminar gasto" }, { status: 500 });
        
    }
}