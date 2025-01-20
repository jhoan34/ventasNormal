"use server";
import { db } from "@/lib/db";


export async function getDb() {

    const ventas = await db.venta.findMany();
    const productos = await db.producto.findMany();
    const gastos = await db.gasto.findMany();
     
    return {ventas, productos, gastos};

}