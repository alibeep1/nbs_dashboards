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

interface StackedAreaChartProps {
  data: any[];
  xKey: string; // Key for X-axis (e.g., "yearMonth")
  yKey: string; // Key for Y-axis values (e.g., "totalBranchSales")
  stackKey: string; // Key to stack by (e.g., "branchName" or "branchCode")
  colors?: string[]; // Colors for each stack
  showGrid?: boolean;
  showYAxis?: boolean;
  sortData?: boolean; // New prop to control data sorting
}

export function StackedAreaChart({
  data = [],
  xKey,
  yKey,
  stackKey,
  colors = ["#60f0c9", "#FC97B2", "#97D0FC", "#F7FF58", "#FC97D1", "#9013FE"],
  showGrid = true,
  showYAxis = false,
  sortData = true,
}: StackedAreaChartProps): React.JSX.Element {
  // Sort original data if needed
  const sortedData = React.useMemo(() => {
    if (!sortData || !data?.length) return data;

    return [...data].sort((a, b) => {
      const aValue = a[xKey];
      const bValue = b[xKey];

      // Try to parse as dates first
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);

      // If both are valid dates, sort by date
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return aDate.getTime() - bDate.getTime();
      }

      // Otherwise, sort as strings
      return String(aValue).localeCompare(String(bValue));
    });
  }, [data, xKey, sortData]);

  // Transform data from array format to stacked format
  const { transformedData, stackKeys, chartConfig } = React.useMemo(() => {
    console.log("Original data:", data);
    console.log("Sorted data:", sortedData);

    if (!sortedData?.length)
      return { transformedData: [], stackKeys: [], chartConfig: {} };

    // Get unique stack values and sort by total value (highest values render last/on top)
    const stackTotals = new Map();
    sortedData.forEach((item) => {
      const stack = item[stackKey];
      stackTotals.set(
        stack,
        (stackTotals.get(stack) || 0) + Number(item[yKey])
      );
    });

    const uniqueStacks = [
      ...new Set(sortedData.map((item) => item[stackKey])),
    ].sort((a, b) => stackTotals.get(a) - stackTotals.get(b)); // Ascending order - highest values render last
    console.log("Unique stacks:", uniqueStacks);

    // Get unique x values (e.g., unique months) and sort them
    const uniqueXValues = [
      ...new Set(sortedData.map((item) => item[xKey])),
    ].sort((a, b) => {
      const aDate = new Date(a);
      const bDate = new Date(b);

      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return aDate.getTime() - bDate.getTime();
      }

      return String(a).localeCompare(String(b));
    });
    console.log("Unique X values (sorted):", uniqueXValues);

    // Transform data to have each stack as a separate property
    const transformed = uniqueXValues.map((xValue) => {
      const baseItem: any = { [xKey]: xValue };

      // For each stack, find the corresponding y value
      uniqueStacks.forEach((stack) => {
        const matchingItem = sortedData.find(
          (item) => item[xKey] === xValue && item[stackKey] === stack
        );
        baseItem[stack] = matchingItem ? Number(matchingItem[yKey]) || 0 : 0;
      });

      return baseItem;
    });

    console.log("Transformed data:", transformed);

    // Generate chart config
    const config: ChartConfig = {};
    uniqueStacks.forEach((stack, index) => {
      config[stack] = {
        label: String(stack),
        color: colors[index % colors.length],
      };
    });

    console.log("Chart config:", config);

    return {
      transformedData: transformed,
      stackKeys: uniqueStacks,
      chartConfig: config,
    };
  }, [sortedData, xKey, yKey, stackKey, colors]);
  // Generate unique gradient IDs for each stack
  const gradientIds = React.useMemo(() => {
    return stackKeys.map((key) => `fill-${key}`);
  }, [stackKeys]);

  if (!transformedData.length) {
    return (
      <Card style={{ border: "none", boxShadow: "none" }}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">📊</div>
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ border: "none", boxShadow: "none" }}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={transformedData}
            style={{ margin: 0, padding: 0 }}
            margin={{
              left: 12,
              right: 12,
              top: 10,
              bottom: 10,
            }}
          >
            {showGrid && <CartesianGrid vertical={false} />}

            {showYAxis && (
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            )}

            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* <defs>
              {stackKeys.map((key, index) => (
                <linearGradient
                  key={key}
                  id={gradientIds[index]}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    // stopColor={`var(--color-${key})`}
                    // stopColor={
                    //   chartConfig[key]?.color || colors[index % colors.length]
                    // }
                    stopColor={`#60f0c9`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`#60f0c9`}
                    // stopColor={
                    //   chartConfig[key]?.color || colors[index % colors.length]
                    // }
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs> */}

            {stackKeys.map(
              (key, index) => (
                console.log("key = ", key),
                (
                  <Area
                    key={key}
                    dataKey={key}
                    type="natural"
                    fill="none"
                    // fill={`url(#${gradientIds[index]})`}
                    // fill={chartConfig[key]?.color}
                    fillOpacity={0.4}
                    stroke={chartConfig[key]?.color}
                    strokeWidth={2}
                    // stackId={"stack"}
                  />
                )
              )
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Usage examples:
/*

// Example 1: Your branch sales data
const branchSalesData = [
  { yearMonth: "2025-07", totalBranchSales: 1200, branchName: "المقر الرئيسي" },
  { yearMonth: "2025-07", totalBranchSales: 800, branchName: "الفرع الأول" },
  { yearMonth: "2025-08", totalBranchSales: 1455, branchName: "المقر الرئيسي" },
  { yearMonth: "2025-08", totalBranchSales: 0, branchName: "الفرع الأول" },
];

<StackedAreaChart 
  data={branchSalesData}
  xKey="yearMonth"
  yKey="totalBranchSales"
  stackKey="branchName"
  colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]}
/>

// This will show:
// - X-axis: "2025-07", "2025-08"
// - Stacked areas for each branch
// - Tooltip showing breakdown per branch

// Example 2: Category sales over time
const categorySalesData = [
  { period: "Q1", sales: 5000, category: "Medicine" },
  { period: "Q1", sales: 3000, category: "Cosmetics" },
  { period: "Q2", sales: 6000, category: "Medicine" },
  { period: "Q2", sales: 3500, category: "Cosmetics" },
];

<StackedAreaChart 
  data={categorySalesData}
  xKey="period"
  yKey="sales"
  stackKey="category"
  showYAxis={true}
/>

*/
