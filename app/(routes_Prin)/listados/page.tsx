import { ListGastos } from "@/app/components/listgastos/listgastos";
import { ProductsList } from "@/app/components/productoslistados/productlist";
import Link from "next/link";

export default function Reporte() {
    return (
        <div className="flex flex-col justify-start items-center bg-black min-h-screen gap-y-16 py-10">
            <section className="w-[90%] relative p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
                <button className="hover:bg-[#bd5167] absolute left-1 top-1 bg-[#EE7890] px-4 py-2 rounded-sm"> <Link className="text-white" href="/productos-descontinuados">Productos Descontinuados</Link></button>
                <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Listado de Productos
                </h2>
                <ProductsList/>
            </section>
            <section className="w-[90%] p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Gastos
              </h2>
              <ListGastos />
            </section>
        </div>
    )
}