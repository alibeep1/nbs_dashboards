"use client";

import React from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartTrendInfo, ReusableAreaChartProps } from "./LineChartTypes";

// import {
//   ReusableAreaChartProps,
//   AreaConfig,
//   ChartTrendInfo
// } from "./reusable-area-chart-types";

export const ReusableAreaChart: React.FC<ReusableAreaChartProps> = ({
  data,
  areas,
  xAxisKey,
  title,
  description,
  trendInfo,
  height = 300,
  showGrid = true,
  showTooltip = true,
  xAxisFormatter,
  margin = { left: 12, right: 12 },
  className,
  cardClassName,
  loading = false,
  error,
  showFooter = true,
  footerContent,
}) => {
  // Generate chart config from areas
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    areas.forEach((area) => {
      config[area.dataKey] = {
        label: area.label,
        color: area.color,
      };
    });
    return config;
  }, [areas]);

  // Generate unique gradient IDs for each area
  const gradientDefs = areas.map((area, index) => (
    <linearGradient
      key={`gradient-${area.dataKey}`}
      id={`fill${area.dataKey}`}
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
    </linearGradient>
  ));

  // Render trend info
  const renderTrendInfo = (trend: ChartTrendInfo) => {
    const isPositive = trend.isPositive ?? trend.percentage > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const trendText =
      trend.description ||
      `${isPositive ? "Trending up" : "Trending down"} by ${Math.abs(
        trend.percentage
      )}% ${trend.period}`;

    return (
      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          <div
            className={cn(
              "flex items-center gap-2 leading-none font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trendText} <TrendIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-red-500 text-center">
            <p className="font-medium">Error loading chart</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty data state
  if (!data || data.length === 0) {
    return (
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-muted-foreground text-center">
            <p>No data available</p>
            <p className="text-sm mt-1">Data will appear here when available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(cardClassName)}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={className}>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={margin}
            height={height}
          >
            {showGrid && <CartesianGrid vertical={false} />}
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxisFormatter}
            />
            {showTooltip && (
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            )}
            <defs>{gradientDefs}</defs>
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                dataKey={area.dataKey}
                type={area.type || "natural"}
                fill={`url(#fill${area.dataKey})`}
                fillOpacity={area.fillOpacity || 0.4}
                stroke={area.color}
                strokeWidth={area.strokeWidth || 2}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {showFooter && (
        <CardFooter>
          {footerContent || (trendInfo && renderTrendInfo(trendInfo))}
        </CardFooter>
      )}
    </Card>
  );
};

export default ReusableAreaChart;
