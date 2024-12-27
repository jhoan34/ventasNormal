import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { descripcion, monto } = body;

        if (!descripcion || !monto) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        const gasto = await db.gasto.create({
            data: {
                descripcion,
                monto: parseFloat(monto)
            }
        })

        if  (!gasto) {
            throw new Error("Error al registrar gasto");
        }

        return NextResponse.json(gasto);

    } catch (error) {
        console.log(error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error al registrar gasto" }, { status: 500 });
    }
}