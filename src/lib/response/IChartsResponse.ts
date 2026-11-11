// Chart type constants based on your API response
export const ChartType = {
  LINE: 1, // Customer Visits Frequency
  AREA: 2, // New Customers by Gender, Customer Behaviour Breakdown
  PIE: 3, // (not present in your data but keeping for completeness)
  DONUT: 4, // Active Branches by Visits, Customer Spend Distribution, Popular Brands
  STACKEDBAR: 5, // Payment Channel Distribution, Popular Categories
  COLUMN: 6, // Added COLUMN type for charts that use column representation
} as const;

export type ChartType = (typeof ChartType)[keyof typeof ChartType];

// Interface for individual data points
export interface ChartDataPoint {
  label: string;
  value: number;
  unit: string;
  // Optional properties for map/location data
  latitude?: number;
  longitude?: number;
}

// Interface for time series data (currently empty in your response)
export interface TimeSeriesData {
  // Define this based on your actual time series structure when available
  [key: string]: unknown;
}

// Interface for individual chart item
export interface ChartItem {
  id: string;
  title: string;
  type: ChartType;
  dataPoints: ChartDataPoint[];
  timeSeriesData: TimeSeriesData[];
}

// Interface for the complete charts API response
export type ChartsApiResponse = ChartItem[];

// Alternative: Explicit array type
export type ChartsResponse = ChartItem[];

// Helper interface for chart identification
export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  hasLocationData: boolean;
  isEmpty: boolean;
  dataPointCount: number;
}

// Utility functions for working with chart data
export class ChartDataUtils {
  /**
   * Find a specific chart by ID
   */
  static findChartById(charts: ChartItem[], id: string): ChartItem | undefined {
    return charts.find((chart) => chart.id === id);
  }

  /**
   * Get charts by type
   */
  static getChartsByType(charts: ChartItem[], type: ChartType): ChartItem[] {
    return charts.filter((chart) => chart.type === type);
  }

  /**
   * Check if chart has location data (for map charts)
   */
  static hasLocationData(chart: ChartItem): boolean {
    return chart.dataPoints.some(
      (point) => point.latitude !== undefined && point.longitude !== undefined
    );
  }

  /**
   * Get chart configuration summary
   */
  static getChartConfig(chart: ChartItem): ChartConfig {
    return {
      id: chart.id,
      title: chart.title,
      type: chart.type,
      hasLocationData: this.hasLocationData(chart),
      isEmpty: chart.dataPoints.length === 0,
      dataPointCount: chart.dataPoints.length,
    };
  }

  /**
   * Transform data points to simple key-value pairs (useful for pie charts)
   */
  static toKeyValuePairs(
    dataPoints: ChartDataPoint[]
  ): Array<{ key: string; value: number }> {
    return dataPoints.map((point) => ({
      key: point.label,
      value: point.value,
    }));
  }

  /**
   * Get total value for a chart (useful for calculating percentages)
   */
  static getTotalValue(dataPoints: ChartDataPoint[]): number {
    return dataPoints.reduce((sum, point) => sum + point.value, 0);
  }
}
export interface CustomerVisitsChart extends ChartItem {
  id: "customer_visits_chart";
  type: typeof ChartType.LINE;
}
export interface BranchVisitsChart extends ChartItem {
  id: "customer_visits_per_branch_chart";
  type: typeof ChartType.COLUMN;
  dataPoints: Array<
    ChartDataPoint & {
      latitude: number;
      longitude: number;
    }
  >;
}

export interface GenderBreakdownChart extends ChartItem {
  id: "gender_breakdown_chart";
  type: typeof ChartType.PIE;
}

export interface CustomerBehaviourChart extends ChartItem {
  id: "repeat_vs_one_time_customers_chart";
  type: typeof ChartType.PIE;
}

export interface SpendDistributionChart extends ChartItem {
  id: "customer_spend_distribution_chart";
  type: typeof ChartType.COLUMN;
}

export interface PaymentChannelChart extends ChartItem {
  id: "payment_channel_distribution_chart";
  type: typeof ChartType.DONUT;
}

export interface PopularCategoriesChart extends ChartItem {
  id: "popular_categories_chart";
  type: typeof ChartType.DONUT;
}

export interface PopularBrandsChart extends ChartItem {
  id: "popular_brands_chart";
  type: typeof ChartType.COLUMN;
}

export interface CustomerCohortAnalysisChartApiResponse {
  cohortMonth: string;
  cohortYear: number;
  monthsSinceStart: number;
  retainedCustomers: number;
  cohortSize: number;
  retentionRate?: number | null;
}
