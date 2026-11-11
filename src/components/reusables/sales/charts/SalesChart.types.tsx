// charts.types.ts
// All chart-related type definitions

export interface BranchSalesTrend {
  chartTitle: "Branch Sales Trend";
  branchCode: string;
  branchName: string;
  yearMonth: string;
  totalBranchSales: number;
}

export interface TopSellingItems {
  chartTitle: "Top Selling Items";
  itemCode: string;
  itemName: string;
  totalQuantitySold: number;
}

export interface TotalRefundValueTrend {
  chartTitle: "Total Refund Value Trend";
  yearMonth: string;
  totalRefundValue: number;
}

export interface SalesByCategory {
  chartTitle: "Sales By Category";
  categoryCode: string;
  categoryDescription: string;
  totalSalesValue: number;
}

export interface PromotionLinkedSales {
  chartTitle: "Promotion-Linked Sales";
  yearMonth: string;
  netSalesValue: number;
}

export interface HourlySalesHeatmap {
  chartTitle: "Hourly Sales Heatmap";
  hourDisplay: string;
  sun: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
}

export interface MarketingCampaignSalesVolume {
  chartTitle: "Marketing Campaign Sales Volume";
  campaignName: string;
  netSalesValue: number;
  createdBy: string;
  createdOn: string;
}

export interface SalesByCustomerType {
  chartTitle: "Sales By Customer Type";
  CustomerTypeDescription: string;
  NetSalesValue: number;
}

export interface TopReturnedItems {
  chartTitle: "Top Returned Items";
  itemCode: string;
  itemName: string;
  returnFrequency: number;
}

export interface TopBrands {
  chartTitle: "Top Brands";
  brandName: string;
  netQuantitySold: number;
}

export interface SalesByBranch {
  chartTitle: "Sales By Branch";
  branchName: string;
  netSales: number;
}

export interface ManualDiscountsOvertime {
  chartTitle: "Total Discount Value";
  yearMonth: string;
  totalDiscountValue: number;
}

// Union type for all possible chart data
export type SalesChartData =
  | BranchSalesTrend
  | TopSellingItems
  | TotalRefundValueTrend
  | SalesByCategory
  | HourlySalesHeatmap
  | TopReturnedItems
  | TopBrands
  | SalesByBranch
  | PromotionLinkedSales
  | ManualDiscountsOvertime
  | MarketingCampaignSalesVolume
  | SalesByCustomerType;
// Raw API response type
export type SalesChartsApiResponse = any[][];

// Processed/organized data structure
export interface ProcessedSalesChartsData {
  branchSalesTrend: BranchSalesTrend[];
  topSellingItems: TopSellingItems[];
  totalRefundValueTrend: TotalRefundValueTrend[];
  salesByCategory: SalesByCategory[];
  hourlySalesHeatmap: HourlySalesHeatmap[];
  topReturnedItems: TopReturnedItems[];
  topBrands: TopBrands[];
  salesByBranch: SalesByBranch[];
  promotionLinkedSales: PromotionLinkedSales[];
  manualDiscountsOvertime: ManualDiscountsOvertime[];
  marketingCampaignSalesVolume: MarketingCampaignSalesVolume[];
  salesByCustomerType: SalesByCustomerType[];
}

// Chart titles enum for better maintainability
export enum SalesChartTitles {
  BRANCH_SALES_TREND = "Branch Sales Trend",
  TOP_SELLING_ITEMS = "Top Selling Items",
  TOTAL_REFUND_VALUE_TREND = "Total Refund Value Trend",
  SALES_BY_CATEGORY = "Sales By Category",
  HOURLY_SALES_HEATMAP = "Hourly Sales Heatmap",
  TOP_RETURNED_ITEMS = "Top Returned Items",
  TOP_BRANDS = "Top Brands",
  SALES_BY_BRANCH = "Sales By Branch",
  PROMOTION_LINKED_SALES = "Promotion-Linked Sales",
  MANUAL_DISCOUNTS_OVERTIME = "Total Discount Value",
  MARKETING_CAMPAIGN_SALES_VOLUME = "Marketing Campaign Sales Volume",
  SALES_BY_CUSTOMER_TYPE = "Sales By Customer Type",
}
