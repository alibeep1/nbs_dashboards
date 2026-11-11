import { type ChartConfig } from "@/components/ui/chart";

// Generic data point interface
export interface ChartDataPoint {
  [key: string]: string | number;
}

// Area configuration for each data series
export interface AreaConfig {
  dataKey: string;
  color: string;
  label: string;
  fillOpacity?: number;
  strokeWidth?: number;
  type?: "natural" | "monotone" | "linear" | "step";
}

// Footer trend information
export interface ChartTrendInfo {
  percentage: number;
  period: string;
  isPositive?: boolean;
  description?: string;
}

// Main props interface for the reusable area chart
export interface ReusableAreaChartProps {
  // Data and configuration
  data: ChartDataPoint[];
  areas: AreaConfig[];
  xAxisKey: string;

  // Card content
  title: string;
  description?: string;
  trendInfo?: ChartTrendInfo;

  // Chart customization
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  xAxisFormatter?: (value: any) => string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  // Styling
  className?: string;
  cardClassName?: string;

  // Loading and error states
  loading?: boolean;
  error?: string;

  // Footer customization
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}
