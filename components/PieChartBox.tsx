"use client";

import { Label, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  products: {
    label: "Products"
  },
  highStocks: {
    label: "High Stocks",
    color: "green"
  },
  lowStocks: {
    label: "Low Stocks",
    color: "red"
  }
} satisfies ChartConfig;

export function PieChartBox({
  totalProducts,
  highCount,
  lowCount
}: {
  totalProducts: number,
  highCount: number,
  lowCount: number
}) {

  const chartData = [
    { name: "High Stocks", value: highCount, fill: "#3b82f6" },
    { name: "Low Stocks", value: lowCount, fill: "#ef4444" }
  ];

    return (
      <Card className='flex flex-col'>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label 
                    content={({ viewBox}) => {
                      if(viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor='middle'
                            dominantBaseline='middle'
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalProducts}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Products
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
            </PieChart>
          </ChartContainer>
          <CardFooter className='flex flex-col gap-2'>
            <div className='flex gap-5'>
                <p>High Stocks</p>
                <span className='text-blue-500'>{((highCount / totalProducts) * 100).toFixed(0)}%</span>
            </div> 
            <div className='flex gap-5'>
                <p>Low Stocks</p>
                <span className='text-red-500'>{((lowCount / totalProducts) * 100).toFixed(0)}%</span>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    )
}