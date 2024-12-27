"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useDatos } from "@/context/usedatos"

const chartConfig = {
  desktop: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Gastos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Graficohistorial() {
  const { gastos, ventas } = useDatos()

  // Procesar datos para la gráfica
  const chartData = ventas.map((venta, index) => {
    const gastoTotal = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
    return {
      month: `Mes ${index + 1}`, // Ajusta esto según los datos reales
      desktop: venta.monto || 0, // Total de ventas
      mobile: gastoTotal, // Total de gastos
    }
  })

  return (
    <Card className="w-[80%] h-[20%] flex flex-col justify-center items-center">
      <CardHeader>
        <CardTitle>Historial de Ventas y Gastos</CardTitle>
        <CardDescription>
          Mostrando datos de los últimos meses
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
              Subiendo un 5.2% este mes <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Historial de datos
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
