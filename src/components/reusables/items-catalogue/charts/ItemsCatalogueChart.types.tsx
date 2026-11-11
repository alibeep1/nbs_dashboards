// Chart Title Enum
export enum ChartTitles {
  DISTRIBUTION_BY_ITEM_TYPE = "Distribution By Item Type",
  DISTRIBUTION_BY_CATEGORY = "Distribution By Category",
  ITEMS_WITH_EXPIRY_BATCH = "Items With Expiry / Batch",
  NEW_ITEMS_OVER_TIME = "New Items Over Time",
  TOP_BRANDS_BY_ITEM_COUNT = "Top Brands By Item Count",
}

// Individual Chart Interfaces
export interface IDistributionByItemType {
  chartTitle: "Distribution By Item Type";
  label: string;
  value: number;
}

export interface IDistributionByCategory {
  chartTitle: "Distribution By Category";
  label: string;
  value: number;
}

export interface IItemsWithExpiryBatch {
  chartTitle: "Items With Expiry / Batch";
  totalItems: number;
  itemsWithExpiryBatch: number;
  percentageWithControl: number;
  itemsWithoutControl: number;
  percentageWithoutControl: number;
}

export interface INewItemsOverTime {
  chartTitle: "New Items Over Time";
  label: string;
  value: number;
}

export interface ITopBrandsByItemCount {
  chartTitle: "Top Brands By Item Count";
  label: string;
  value: number;
}

// Union type of all chart data types
export type ItemsCatalogueChartData =
  | IDistributionByItemType
  | IDistributionByCategory
  | IItemsWithExpiryBatch
  | INewItemsOverTime
  | ITopBrandsByItemCount;

// API Response type
export type ItemsCatalogueChartsApiResponse = any[][];

// Processed chart data interface
export interface ProcessedItemsCatalogueChartData {
  distributionByItemType: IDistributionByItemType[];
  distributionByCategory: IDistributionByCategory[];
  itemsWithExpiryBatch: IItemsWithExpiryBatch[];
  newItemsOverTime: INewItemsOverTime[];
  topBrandsByItemCount: ITopBrandsByItemCount[];
}
