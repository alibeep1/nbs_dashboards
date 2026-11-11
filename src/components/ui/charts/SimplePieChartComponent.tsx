"use client";

import React from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SimplePieChartProps {
  data: any[];
  labelKey: string; // Key for slice labels (e.g., "browser", "category")
  valueKey: string; // Key for slice values (e.g., "visitors", "amount")
  fillKey?: string; // Optional key for custom fill colors in data
  colorPalette?: string[]; // Color palette for slices
  innerRadius?: number; // Inner radius for donut chart (0 for full pie)
  outerRadius?: number; // Outer radius
  showLegend?: boolean; // Show/hide legend
  showTooltip?: boolean; // Show/hide tooltip
  hideTooltipLabel?: boolean; // Hide label in tooltip
  chartSize?: number; // Chart container size
  legendClassName?: string; // Custom legend styling
  children?: React.ReactNode; // For additional Bars (stacked bars)
}

export function SimplePieChart({
  data = [],
  labelKey,
  valueKey,
  fillKey,
  colorPalette = [
    "#60f0c9",
    "#FC97B2",
    "#97D0FC",
    "#F7FF58",
    "#FC97D1",
    "#9013FE",
  ],
  innerRadius = 60,
  outerRadius,
  showLegend = true,
  showTooltip = true,
  hideTooltipLabel = true,
  chartSize = 250,
  legendClassName = "-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center",
  children, // For additional Bars (stacked bars)
}: SimplePieChartProps): React.JSX.Element {
  // Generate chart config dynamically based on data
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      [valueKey]: {
        label: valueKey?.charAt(0).toUpperCase() + valueKey?.slice(1),
      },
    };

    // Add config for each unique label
    data.forEach((item, index) => {
      const label = item[labelKey];
      if (label && !config[label]) {
        config[label] = {
          label: label.charAt(0).toUpperCase() + label.slice(1),
          color:
            fillKey && item[fillKey]
              ? item[fillKey]
              : colorPalette[index % colorPalette.length],
        };
      }
    });

    return config;
  }, [data, labelKey, valueKey, fillKey, colorPalette]);

  // Process data to ensure proper structure and colors
  const processedData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill:
        fillKey && item[fillKey]
          ? item[fillKey]
          : colorPalette[index % colorPalette.length],
    }));
  }, [data, fillKey, colorPalette]);

  // if data is empty, return "no avaiable data"
  if (!data || data.length === 0) {
    // show a placeholder pie

    return (
      <Card style={{ border: "none", boxShadow: "none" }}>
        <CardContent className="flex items-center justify-center">
          <div className="text-gray-500">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-col"
      style={{ border: "none", boxShadow: "none" }}
    >
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={`mx-auto aspect-square max-h-[${chartSize}px] w-[${chartSize}px] h-[${chartSize}px]`}
        >
          <PieChart>
            {showTooltip && (
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel={hideTooltipLabel} />}
              />
            )}

            <Pie
              data={processedData}
              dataKey={valueKey}
              nameKey={labelKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
            />

            {children}

            {/* {showLegend && (
              <ChartLegend
                content={<ChartLegendContent nameKey={labelKey} />}
                className={legendClassName}
              />
            )} */}
          </PieChart>
        </ChartContainer>
        {/* Move legend outside of PieChart component */}
        {showLegend && (
          <div
            className={`flex items-center justify-center mt-4 ${legendClassName}`}
          >
            {processedData.map((item, index) => (
              <div
                key={item[labelKey]}
                className="flex items-center gap-1 text-xs"
              >
                <div
                  className="min-w-2 min-h-2 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-gray-600">{item[labelKey]}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
