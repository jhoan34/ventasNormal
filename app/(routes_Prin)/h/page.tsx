import { HistorialVentas } from "@/app/components/historialVentas/historialVentas";
import { ListGastos } from "@/app/components/listgastos/listgastos";

export default function Gastos_ventas() {
   return (
        <div className="flex flex-col justify-start items-center bg-black min-h-screen gap-y-16 py-10">
            <section className="w-[90%] p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Ventas
              </h2>
              <HistorialVentas />
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