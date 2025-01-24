import Link from "next/link";
import { FormGastos } from "./components/formgastos/formgastos";
import { FormProductos } from "./components/formproductos/formproductos";
import { FormVentas } from "./components/formventas/formVentas";
import { ProductsList } from "./components/productoslistados/productlist";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center bg-black min-h-screen gap-y-16 py-10">
      {/* Sección Principal */}
      <section className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-950 rounded-lg shadow-lg">
        <div id="productos" className="text-center bg-[#EE7890] p-8 rounded-lg shadow-sm border-2 border-black">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-pink-500 inline-block">
            Productos
          </h2>
          <FormProductos />
        </div>

        <div id="ventas" className="text-center bg-[#EE7890] p-8 rounded-lg shadow-sm border-2 border-black">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-pink-500 inline-block">
            Ventas
          </h2>
          <FormVentas />
        </div>

        <div id="finanzas" className="text-center bg-[#EE7890] p-8 rounded-lg shadow-sm border-2 border-black">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-pink-500 inline-block">
            Gastos
          </h2>
          <FormGastos />
        </div>
      </section>
      <section className="w-[90%] relative p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
          <button className="hover:bg-[#bd5167] absolute left-1 top-1 bg-[#EE7890] px-4 py-2 rounded-sm"> <Link className="text-white" href="/productos-descontinuados">Productos Descontinuados</Link></button>
          <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
          Listado de Productos
          </h2>
          <ProductsList/>
      </section>
    </main>
  );
}
