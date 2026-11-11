"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface MetadataConfig {
  show: boolean;
  columns: {
    key: string;
    label: string;
    formatter?: (value: any) => string;
  }[];
}

interface SimpleBarChartProps {
  data: any[];
  xKey: string; // Key for X-axis data
  yKey: string; // Key for Y-axis data
  fillColor?: string;
  strokeColor?: string;
  layout?: "horizontal" | "vertical" | "inverted-vertical";
  label?: string; // Label for the data series
  showYAxisLabels?: boolean; // Show/hide Y-axis labels (default: false)
  metadata?: MetadataConfig; // New metadata configuration
  chartTitle?: string; // Optional chart title
  height?: number; // Add this

  children?: React.ReactNode; // For additional Bars (stacked bars)
}

// Custom Tooltip Component
export const CustomTooltip = ({ active, payload, label, metadata }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <div className="font-semibold mb-2">{label}</div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{payload[0].dataKey}:</span>
            <span className="font-medium ml-2">{payload[0].value}</span>
          </div>
          {metadata?.show &&
            metadata.columns.map((col: any) => (
              <div
                key={col.key}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-600">{col.label}:</span>
                <span className="font-sm ml-2">
                  {col.formatter ? col.formatter(data[col.key]) : data[col.key]}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
};

export function SimpleBarChart({
  data = [],
  xKey,
  yKey,
  fillColor = "#60f0c9",
  strokeColor,
  layout = "vertical",
  label = "Value",
  showYAxisLabels = false,
  metadata,
  chartTitle,
  height,
  children,
}: SimpleBarChartProps): React.JSX.Element {
  // Generate chart config based on the data key
  const chartConfig = {
    [yKey]: {
      label: label,
      color: fillColor,
    },
  } satisfies ChartConfig;

  const isHorizontal = layout === "horizontal";
  const isVertical = layout === "vertical";
  const isInvertedVertical = layout === "inverted-vertical";

  // For inverted vertical, we reverse the data order AND use different chart layout
  const chartData = isInvertedVertical ? [...data].reverse() : data;

  // Truncate function for labels
  const truncateLabel = (label: string, maxLength: number = 15) => {
    if (typeof label !== "string") return label;
    return label.length > maxLength
      ? label.substring(0, maxLength) + "..."
      : label;
  };

  // Determine the actual Recharts layout
  const rechartsLayout =
    isVertical || isInvertedVertical ? "horizontal" : "vertical";

  // Default formatters for common metadata fields
  const defaultFormatters = {
    percentage: (value: any) => `${Number(value).toFixed(1)}%`,
    currency: (value: any) => `EGP${Number(value).toLocaleString()}`,
    number: (value: any) => Number(value).toLocaleString(),
    decimal: (value: any) => Number(value).toFixed(2),
  };
  // Format large numbers for Y-axis (when displaying numeric values)
  const formatYAxisNumber = (value: number) => {
    if (typeof value !== "number") return value;

    // Handle zero
    if (value === 0) return "0";

    // For values >= 1 million
    if (Math.abs(value) >= 1000000) {
      const millions = value / 1000000;
      // Show one decimal place, but remove if it's .0
      return millions % 1 === 0
        ? `${millions.toFixed(0)}M`
        : `${millions.toFixed(1)}M`;
    }

    // For values >= 1 thousand
    if (Math.abs(value) >= 1000) {
      const thousands = value / 1000;
      // Show one decimal place, but remove if it's .0
      return thousands % 1 === 0
        ? `${thousands.toFixed(0)}K`
        : `${thousands.toFixed(1)}K`;
    }

    // For smaller values, show as-is
    return value.toFixed(0);
  };

  return (
    <div className="w-full">
      {chartTitle && (
        <Card
          style={{ border: "none", boxShadow: "none", marginBottom: "1rem" }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              {chartTitle}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <Card style={{ border: "none", boxShadow: "none" }}>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout={rechartsLayout}
              margin={{
                left: isHorizontal ? 10 : 10, // Changed from -20 to 10
                right: 10,
                top: isInvertedVertical ? 30 : 10,
                bottom: isInvertedVertical ? 10 : 30,
              }}
            >
              <XAxis
                type={isHorizontal ? "number" : "category"}
                dataKey={isHorizontal ? yKey : xKey}
                hide={isHorizontal}
                tickLine={!isHorizontal}
                axisLine={!isHorizontal}
                orientation={isInvertedVertical ? "top" : "bottom"}
                tickFormatter={(value) => truncateLabel(value)}
              />
              <YAxis
                type={isHorizontal ? "category" : "number"}
                dataKey={isHorizontal ? xKey : yKey}
                tickLine={showYAxisLabels}
                tickMargin={10}
                axisLine={false}
                hide={!showYAxisLabels}
                reversed={isInvertedVertical}
                tickFormatter={(value) => {
                  // For horizontal layout, format category labels
                  if (isHorizontal) {
                    return truncateLabel(value);
                  }
                  // For vertical/inverted-vertical, format numbers
                  return formatYAxisNumber(value);
                }}
                // tickFormatter={(value) =>
                //   isHorizontal ? truncateLabel(value) : value
                // }
              />
              <ChartTooltip
                cursor={false}
                content={
                  metadata?.show && metadata.columns?.length > 0 ? (
                    (props) => <CustomTooltip {...props} metadata={metadata} />
                  ) : (
                    <ChartTooltipContent />
                  )
                }
              />
              <Bar
                dataKey={yKey}
                fill={fillColor}
                stroke={strokeColor}
                radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
              />
              {/* Add more Bars here if needed for stacked bars */}
              {children}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Usage example with dynamic colors based on priority:
/*
const invoiceData = [
  {
    "label": "High Priority",
    "value": 37,
    "priority": "high",
    "percentageOfTotalInvoices": 77.08,
    // ... other metadata
  },
  {
    "label": "Medium Priority", 
    "value": 25,
    "priority": "medium",
    "percentageOfTotalInvoices": 15.5,
    // ... other metadata
  },
  {
    "label": "Low Priority",
    "value": 12, 
    "priority": "low",
    "percentageOfTotalInvoices": 7.42,
    // ... other metadata
  }
];

const priorityColorConfig = {
  statusKey: "priority",
  colorMap: {
    "high": "#ef4444",     // red-500
    "medium": "#f59e0b",   // amber-500  
    "low": "#10b981",      // emerald-500
    "critical": "#dc2626", // red-600
    "normal": "#6b7280",   // gray-500
  },
  defaultColor: "#60f0c9" // fallback color
};

const metadataConfig = {
  show: true,
  columns: [
    { 
      key: "priority", 
      label: "Priority"
    },
    { 
      key: "percentageOfTotalInvoices", 
      label: "% of Total Invoices",
      formatter: (value) => `${Number(value).toFixed(1)}%`
    },
    // ... other metadata columns
  ]
};

<SimpleBarChart
  data={invoiceData}
  xKey="label"
  yKey="value"
  showYAxisLabels={true}
  strokeColor="#374151"
  label="invoices"
  chartTitle="Invoice Distribution by Priority"
  colorConfig={priorityColorConfig}
  metadata={metadataConfig}
/>
*/

// "use client";

// import { Bar, BarChart, XAxis, YAxis } from "recharts";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   type ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// interface SimpleBarChartProps {
//   data: any[];
//   xKey: string; // Key for X-axis data
//   yKey: string; // Key for Y-axis data
//   fillColor?: string;
//   layout?: "horizontal" | "vertical" | "inverted-vertical";
//   label?: string; // Label for the data series
//   showYAxisLabels?: boolean; // Show/hide Y-axis labels (default: false)
// }

// export function SimpleBarChart({
//   data = [],
//   xKey,
//   yKey,
//   fillColor = "#60f0c9",
//   layout = "vertical",
//   label = "Value",
//   showYAxisLabels = false,
// }: SimpleBarChartProps): React.JSX.Element {
//   // Generate chart config based on the data key
//   const chartConfig = {
//     [yKey]: {
//       label: label,
//       color: fillColor,
//     },
//   } satisfies ChartConfig;

//   const isHorizontal = layout === "horizontal";
//   const isVertical = layout === "vertical";
//   const isInvertedVertical = layout === "inverted-vertical";

//   // For inverted vertical, we reverse the data order AND use different chart layout
//   const chartData = isInvertedVertical ? [...data].reverse() : data;

//   // Truncate function for labels
//   const truncateLabel = (label: string, maxLength: number = 15) => {
//     if (typeof label !== "string") return label;
//     return label.length > maxLength
//       ? label.substring(0, maxLength) + "..."
//       : label;
//   };
//   // Determine the actual Recharts layout
//   const rechartsLayout =
//     isVertical || isInvertedVertical ? "horizontal" : "vertical";

//   return (
//     <Card style={{ border: "none", boxShadow: "none" }}>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             layout={rechartsLayout}
//             margin={{
//               left: isHorizontal ? 10 : -20,
//               right: 10,
//               top: isInvertedVertical ? 30 : 10,
//               bottom: isInvertedVertical ? 10 : 30,
//             }}
//           >
//             <XAxis
//               type={isHorizontal ? "number" : "category"}
//               dataKey={isHorizontal ? yKey : xKey}
//               hide={isHorizontal}
//               tickLine={!isHorizontal}
//               axisLine={!isHorizontal}
//               orientation={isInvertedVertical ? "top" : "bottom"}
//               tickFormatter={(value) => truncateLabel(value)}
//             />
//             <YAxis
//               type={isHorizontal ? "category" : "number"}
//               dataKey={isHorizontal ? xKey : yKey}
//               tickLine={showYAxisLabels}
//               tickMargin={10}
//               axisLine={false}
//               hide={!showYAxisLabels}
//               // hide={!isHorizontal}
//               // label={"xyz"}
//               reversed={isInvertedVertical}
//               tickFormatter={(value) =>
//                 isHorizontal ? truncateLabel(value) : value
//               }
//             />
//             <ChartTooltip
//               cursor={false}
//               animationEasing="ease-in-out"
//               // animationDuration={150}

//               content={
//                 <ChartTooltipContent>
//                   <span>Hello World</span>
//                 </ChartTooltipContent>
//               }
//             />
//             <Bar
//               dataKey={yKey}
//               fill={fillColor}
//               radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

// Usage examples:
/*

// Example 1: Your original data
const originalData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
];

<SimpleBarChart 
  data={originalData}
  xKey="month"
  yKey="desktop"
  fillColor="#60f0c9"
  layout="vertical"
  label="Desktop Users"
/>

// Example 2: Branch sales data
const branchData = [
  { branchName: "Main Branch", totalSales: 45000 },
  { branchName: "North Branch", totalSales: 32000 },
];

<SimpleBarChart 
  data={branchData}
  xKey="branchName"
  yKey="totalSales"
  fillColor="#10b981"
  layout="horizontal"
  label="Sales"
/>

// Example 3: Category data
const categoryData = [
  { categoryDescription: "Medicine", totalSalesValue: 25000 },
  { categoryDescription: "Cosmetics", totalSalesValue: 18000 },
];

<SimpleBarChart 
  data={categoryData}
  xKey="categoryDescription"
  yKey="totalSalesValue"
  fillColor="#3b82f6"
/>

*/
