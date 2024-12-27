import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json();
    const { productoId, cantidad, monto, ganancia } = body;

    // Validar que los campos requeridos estén presentes
    if (!productoId || !cantidad || !monto || !ganancia) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios: productoId, cantidad, monto, ganancia." },
        { status: 400 }
      );
    }

    // Validar que la cantidad sea mayor a 0
    if (cantidad <= 0) {
      return NextResponse.json(
        { error: "La cantidad debe ser un valor positivo." },
        { status: 400 }
      );
    }

    // Verificar el stock del producto
    const producto = await db.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "El producto no existe." },
        { status: 404 }
      );
    }

    if (producto.stock < cantidad) {
      return NextResponse.json(
        { error: `Stock insuficiente. Disponible: ${producto.stock}` },
        { status: 400 }
      );
    }

    // Crear la venta en la base de datos
    const venta = await db.venta.create({
      data: {
        productoId,
        cantidad,
        monto,
        ganancia,
      },
    });

    // Actualizar el stock del producto relacionado
    const productoActualizado = await db.producto.update({
      where: { id: productoId },
      data: {
        stock: { decrement: cantidad }, // Disminuir el stock del producto
      },
    });

    return NextResponse.json(
      { message: "Venta creada exitosamente", venta, producto: productoActualizado },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la venta:", error instanceof Error ? error.message : "Error desconocido");
    return NextResponse.json(
      { error: "Error al crear la venta. Por favor, verifica los datos enviados." },
      { status: 500 }
    );
  }
}
