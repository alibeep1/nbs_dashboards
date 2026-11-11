"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";

export interface StackedBarSeries {
  key: string;
  label: string;
  color?: string;
}

interface StackedBarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: StackedBarSeries[];
  showYAxisLabels?: boolean;
  colors?: string[];
}

const defaultColors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
];

const truncateLabel = (label: string, maxLength = 15): string =>
  label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;

const formatYAxisNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) return `${Number(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${Number(value / 1000).toFixed(1)}K`;
  return Number(value).toFixed(0);
};

export function StackedBarChart({
  data = [],
  xKey,
  series,
  showYAxisLabels = false,
  colors = defaultColors,
}: StackedBarChartProps): React.JSX.Element {
  const chartConfig = series.reduce<ChartConfig>((config, item, index) => {
    config[item.key] = {
      label: item.label,
      color: item.color || colors[index % colors.length],
    };
    return config;
  }, {});

  return (
    <div className="w-full">
      <Card style={{ border: "none", boxShadow: "none" }}>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 10, right: 10, top: 10, bottom: 30 }}
            >
              <XAxis
                type="category"
                dataKey={xKey}
                tickLine
                axisLine
                tickFormatter={(value) => truncateLabel(String(value))}
              />
              <YAxis
                type="number"
                tickLine={showYAxisLabels}
                tickMargin={10}
                axisLine={false}
                hide={!showYAxisLabels}
                tickFormatter={(value) => formatYAxisNumber(Number(value))}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {series.map((item, index) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  stackId="headcount"
                  fill={item.color || colors[index % colors.length]}
                  radius={index === series.length - 1 ? [8, 8, 0, 0] : 0}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
