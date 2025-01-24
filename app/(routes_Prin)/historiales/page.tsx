import { HistorialFinan } from "@/app/components/historialFinan/historialFinan";
import { HistorialVentas } from "@/app/components/historialVentas/historialVentas";
import { ReporteFinanciero } from "@/app/components/reportefin/reportefinanciero";
import { GeneratePdf } from "@/lib/pdf";

export default function Historiales() {
    return (
        <div className="flex flex-col justify-start items-center bg-black min-h-screen gap-y-16 py-10">
            <section className="w-[90%] p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Ventas
              </h2>
              <HistorialVentas />
            </section>
            
            <section className="relative w-[90%] p-16 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
              <GeneratePdf/>
              <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Historial de reporte_financiero
              </h2>
              <HistorialFinan />
            </section>

            {/* Reporte Financiero */}
            <section className="w-[90%] p-8 bg-gray-950 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-center border-b-4 border-pink-500 inline-block">
                Reporte Financiero
              </h2>
              <ReporteFinanciero />
            </section>
            
        </div>
    );
}