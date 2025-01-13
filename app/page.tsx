import Link from "next/link";
import { FormGastos } from "./components/formgastos/formgastos";
import { FormProductos } from "./components/formproductos/formproductos";
import { FormVentas } from "./components/formventas/formVentas";
import { Graficohistorial } from "./components/graficohistorial/graficohistorial";
import { ListGastos } from "./components/listgastos/listgastos";
import { ProductsList } from "./components/productoslistados/productlist";
import { ReporteFinanciero } from "./components/reportefin/reportefinanciero";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center bg-black min-h-screen gap-y-16 py-10">
      {/* Sección Principal */}
      <section className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-100 rounded-lg shadow-lg">
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
            Finanzas
          </h2>
          <FormGastos />
        </div>
      </section>

      {/* Listado de Productos */}
      <section className="w-[90%] relative p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <button className="hover:bg-[#bd5167] absolute left-1 top-1 bg-[#EE7890] text-black px-4 py-2 rounded-md"> <Link className="text-black hover:text-[#000000]" href="/productos-descontinuados">Productos Descontinuados</Link></button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-500 inline-block">
          Listado de Productos
        </h2>
        <ProductsList />
      </section>

      {/* Gastos */}
      <section className="w-[90%] p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-500 inline-block">
          Gastos
        </h2>
        <ListGastos />
      </section>

      {/* Reporte Financiero */}
      <section className="w-[90%] p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-500 inline-block">
          Reporte Financiero
        </h2>
        <ReporteFinanciero />
      </section>

      {/* Historial Gráfico */}
      <section className="w-[90%] p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-500 inline-block">
          Historial Gráfico
        </h2>
        <Graficohistorial />
      </section>
    </main>
  );
}
