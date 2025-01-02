"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDatos } from "@/context/usedatos";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function Graficohistorial() {
  const { gastos = [], ventas = [] } = useDatos();

  // Depuración: Verifica los datos
  console.log("Gastos:", gastos);
  console.log("Ventas:", ventas);
  
  // Calcular totales
  const totalGastos = gastos.reduce(
    (acc, gasto) => acc += (gasto.monto || 0),
    0
  );
  
  const totalVentas = ventas.reduce(
    (acc, venta) => ({
      ganancia: acc.ganancia + (venta.ganancia || 0),
      cantidad: acc.cantidad + (venta.cantidad || 0),
      monto: acc.monto + (venta.monto || 0),
    }),
    { ganancia: 0, cantidad: 0, monto: 0 }
  );
  
  console.log("Total Ventas:", totalVentas);
  console.log("Total Gastos:", totalGastos);
  
  // Generar datos para la gráfica
  const chartData = meses.slice(0, -1 ).map((mes) => ({
    month: mes,
    desktop: totalVentas.ganancia, // Ganancia total de ventas
    mobile: totalGastos || 0,          // Total de gastos
  }));
  
  console.log("Chart Data:", chartData);


  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
