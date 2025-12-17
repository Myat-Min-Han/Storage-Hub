"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { use } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  product: {
    label: "product",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function AreaChartBox({
  data
}: { data: Promise<{ day: string, product: number }[]> }) {

  const datas = use(data)

  const chartData = datas.map(i => {
    return {
      day: i.day,
      product: i.product
    }
  });

  if (datas.length == 0) {
    return (
      <Card>
        <CardHeader>
          <CardDescription>No data to show</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Showing total products for the last 6 days
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
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="product"
              type="natural"
              fill="#3b82f6"
              fillOpacity={0.4}
              stroke="#3b82f6"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}