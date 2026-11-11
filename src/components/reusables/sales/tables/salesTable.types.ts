// Top Salesmen Table Types
export interface ITableTopSalesmen {
  salesPersonCode: string;
  salesPersonName: string;
  netSalesValue: number;
  transactions: number;
  avgTransactionValue: number;
  branchCode: string;
  branchName: string;
}

export interface ITopSalesmenApiResponse {
  items: ITableTopSalesmen[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Items in Today's Promotions Table Types
export interface ITableItemsInTodaysPromotions {
  itemCode: string;
  itemName: string;
  category: string;
}

export interface IItemsInTodaysPromotionsApiResponse {
  items: ITableItemsInTodaysPromotions[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Marketing Campaigns Table Types
export interface ITableMarketingCampaigns {
  campaignCode: string;
  campaignName: string;
  status: string;
  type: string;
  startDate: string;
  createdBy: string;
  createdOn: string;
}

export interface IMarketingCampaignsApiResponse {
  items: ITableMarketingCampaigns[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
