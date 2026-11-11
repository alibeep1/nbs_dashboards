"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CustomTooltip, type MetadataConfig } from "./SimpleBarChart";

interface SimpleAreaChartGradientProps {
  data: any[];
  xKey: string; // Key for X-axis data
  yKey: string; // Key for Y-axis data
  fillColor?: string;
  strokeColor?: string;
  label?: string; // Static label for the data series OR key name for dynamic labels
  labelKey?: string; // Key to use for dynamic labels in tooltip/legend
  showGrid?: boolean;
  showYAxis?: boolean;
  metadata?: MetadataConfig; // New metadata configuration
}

export function SimpleAreaChartGradient({
  data = [],
  xKey,
  yKey,
  fillColor = "var(--chart-1)",
  strokeColor,
  label = "Value",
  labelKey, // New prop for dynamic labels
  showGrid = true,
  showYAxis = false,
  metadata,
}: SimpleAreaChartGradientProps): React.JSX.Element {
  // Generate chart config based on the data key
  const chartConfig = {
    [yKey]: {
      label: label,
      color: fillColor,
    },
  } satisfies ChartConfig;

  // Use strokeColor if provided, otherwise use fillColor
  const finalStrokeColor = strokeColor || fillColor;

  // Generate unique gradient ID to avoid conflicts
  const gradientId = `fill-${yKey}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Card style={{ border: "none", boxShadow: "none" }}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            style={{ margin: 0, padding: 0 }}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 10,
            }}
          >
            {showGrid && <CartesianGrid vertical={false} />}

            {showYAxis && (
              <YAxis tickLine={true} axisLine={true} tickMargin={8} />
            )}

            <XAxis
              dataKey={xKey}
              tickLine={true}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={true}
              content={
                metadata?.show && metadata.columns?.length > 0 ? (
                  (props) => <CustomTooltip {...props} metadata={metadata} />
                ) : (
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      // If labelKey is provided, show dynamic label from data
                      if (labelKey && payload?.[0]?.payload) {
                        const dynamicLabel = payload[0].payload[labelKey];
                        return `${value} - ${dynamicLabel}`;
                      }
                      return value;
                    }}
                    formatter={(value, name) => [value, label]}
                  />
                )
              }
            />

            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${yKey})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${yKey})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey={yKey}
              type="natural"
              fill={`url(#${gradientId})`}
              fillOpacity={0.4}
              stroke={finalStrokeColor}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Usage examples:
/*

// Example 1: Branch Sales - will aggregate by yearMonth and show breakdown
const branchSalesData = [
  { yearMonth: "2025-08", totalBranchSales: 1455, branchName: "المقر الرئيسي" },
  { yearMonth: "2025-08", totalBranchSales: 0, branchName: "الفرع الأول" },
  { yearMonth: "2025-09", totalBranchSales: 2000, branchName: "المقر الرئيسي" },
  { yearMonth: "2025-09", totalBranchSales: 500, branchName: "الفرع الأول" },
];

<SimpleAreaChartGradient 
  data={branchSalesData}
  xKey="yearMonth"
  yKey="totalBranchSales"
  fillColor="#10b981"
  label="Sales"
  labelKey="branchName"  // Will aggregate and show: "2025-08" with total 1455 (المقر الرئيسي: 1455, الفرع الأول: 0)
/>

// Result: X-axis shows unique months, Y-axis shows totals, tooltip shows breakdown

// Example 2: Without aggregation (no labelKey)
const salesTrendData = [
  { yearMonth: "2024-01", totalSales: 45000 },
  { yearMonth: "2024-02", totalSales: 52000 },
  { yearMonth: "2024-03", totalSales: 48000 },
];

<SimpleAreaChartGradient 
  data={salesTrendData}
  xKey="yearMonth"
  yKey="totalSales"
  fillColor="#10b981"
  label="Sales"
  // No labelKey = no aggregation, works as before
/>

*/
