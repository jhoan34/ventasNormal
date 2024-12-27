import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const ventas = await db.venta.findMany();
        const productos = await db.producto.findMany();
        const gastos = await db.gasto.findMany();
         
        return NextResponse.json({ventas, productos, gastos});
    } catch (error) {
        console.log(error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}