// Chart Title Enum
export enum ChartTitles {
  INVOICES_ISSUED_OVER_TIME = "Invoices Issued Over Time",
  TOP_CUSTOMERS_BY_SALES_VOLUME = "Top Customers by Sales Volume",
  PAYMENT_STATUS_SPLIT = "Payment Status Split",
  PAYMENT_METHOD_DISTRIBUTION = "Payment Method Distribution",
  CORPORATE_CUSTOMERS_CONTRIBUTION = "Corporate Customers Contribution",
  RETURN_INVOICES_OVER_TIME = "Return Invoices Over Time",
  AVERAGE_PAYMENT_DELAY_BY_CUSTOMER = "Average Payment Delay by Customer (Days)",
  SEASONAL_PAYMENT_PATTERNS = "Seasonal Payment Patterns",
  INVOICE_SIZE_DISTRIBUTION = "Invoice Size Distribution",
}

// Individual Chart Interfaces
export interface IInvoicesIssuedOverTime {
  chartTitle: "Invoices Issued Over Time";
  label: string;
  value: number;
}

export interface ITopCustomersBySalesVolume {
  chartTitle: "Top Customers by Sales Volume";
  label: string;
  value: number;
}

export interface IPaymentStatusSplit {
  chartTitle: "Payment Status Split";
  label: string;
  value: number;
  totalValue: number;
  totalPaid: number;
  remainingAmount: number;
  percentage: number;
}

export interface IPaymentMethodDistribution {
  chartTitle: "Payment Method Distribution";
  label: string;
  value: number;
  transactionCount: number;
  percentage: number;
}

export interface ICorporateCustomersContribution {
  chartTitle: "Corporate Customers Contribution";
  label: string;
  value: number;
  customerCode: string;
  netSalesValue: number;
  remainingAmount: number;
}

export interface IReturnInvoicesOverTime {
  chartTitle: "Return Invoices Over Time";
  label: string;
  value: number;
}

export interface IAveragePaymentDelayByCustomerDays {
  chartTitle: "Average Payment Delay by Customer (Days)";
  label: string;
  value: number;
  customerCode: string;
}

export interface ISeasonalPaymentPatterns {
  chartTitle: "Seasonal Payment Patterns";
  label: string;
  value: number;
  avgPaymentDays: number;
  maxPaymentDays: number;
  avgPaymentAmount: number;
}

export interface IInvoiceSizeDistribution {
  chartTitle: "Invoice Size Distribution";
  label: string;
  value: number;
  percentageOfTotalInvoices: number;
  minValue: number;
  maxValue: number;
  avgValue: number;
  totalValue: number;
  percentageOfTotalValue: number;
}

// Union type of all chart data types
export type CorpSalesChartData =
  | IInvoicesIssuedOverTime
  | ITopCustomersBySalesVolume
  | IPaymentStatusSplit
  | IPaymentMethodDistribution
  | ICorporateCustomersContribution
  | IReturnInvoicesOverTime
  | IAveragePaymentDelayByCustomerDays
  | ISeasonalPaymentPatterns
  | IInvoiceSizeDistribution;

// API Response type
export type CorpSalesChartsApiResponse = any[][];

// Processed chart data interface
export interface ProcessedCorpSalesChartData {
  invoicesIssuedOverTime: IInvoicesIssuedOverTime[];
  topCustomersBySalesVolume: ITopCustomersBySalesVolume[];
  paymentStatusSplit: IPaymentStatusSplit[];
  paymentMethodDistribution: IPaymentMethodDistribution[];
  corporateCustomersContribution: ICorporateCustomersContribution[];
  returnInvoicesOverTime: IReturnInvoicesOverTime[];
  averagePaymentDelayByCustomerDays: IAveragePaymentDelayByCustomerDays[];
  seasonalPaymentPatterns: ISeasonalPaymentPatterns[];
  invoiceSizeDistribution: IInvoiceSizeDistribution[];
}
