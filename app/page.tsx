import { FormGastos } from "./components/formgastos/formgastos";
import { FormProductos } from "./components/formproductos/formproductos";
import { FormVentas } from "./components/formventas/formVentas";
import { Graficohistorial } from "./components/graficohistorial/graficohistorial";
import { ListGastos } from "./components/listgastos/listgastos";
import { ProductsList } from "./components/productoslistados/productlist";
import { ReporteFinanciero } from "./components/reportefin/reportefinanciero";

export default function Home() {
  return (
    <main className="flex flex-col justify-end items-center bg-gradient-to-t bg-[#Ee7890] min-h-screen gap-y-20">
      <section className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-6 p-10 bg-black rounded-lg mt-10">
        <div id="productos" className="mb-12 text-center bg-black p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b-4 border-red-500 inline-block">
            Productos
          </h2>
          <FormProductos />
        </div>

        <div id="ventas" className="mb-12 text-center bg-black p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b-4 border-red-500 inline-block">
            Ventas
          </h2>
          <FormVentas />
        </div>

        <div id="finanzas" className="mb-12 text-center bg-black p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b-4 border-red-500 inline-block">
            Finanzas
          </h2>
          <FormGastos />
        </div>
      </section>

      <section className="w-[90%] p-8 bg-black rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b-4 border-red-500 inline-block">
          Listado de Productos
        </h2>
        <ProductsList />
      </section>

      <section className="w-[90%] flex flex-col justify-center items-center bg-black p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b-4 border-red-500 inline-block">
          Gastos
        </h2>
        <ListGastos />
      </section>

      <section className="w-[90%] p-6 bg-black flex flex-col justify-center items-center rounded-lg ">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b-4 border-red-500 inline-block">
          Reporte Financiero
        </h2>
        <ReporteFinanciero />
      </section>

      <section className="w-[90%] p-10 bg-black flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b-4 border-red-500 inline-block">
          Historial Gráfico
        </h2>
        <Graficohistorial />
      </section>
    </main>
  );
}
