export interface ICorpInvoiceAging {
  invoiceNo: string;
  customerName: string;
  invoiceDate: Date;
  dueDate: Date;
  daysOverdue: number;
  amount: number;
  priority: string;
}

export interface ITableCorpInvoiceAgingApiResponse {
  items: ICorpInvoiceAging[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ICorpClaimedInvoices {
  invoiceNo: string;
  customerName: string;
  status: string;
  amount: number;
  documentDate: string;
}

export interface ITableCorpClaimedInvoicesApiResponse {
  items: ICorpClaimedInvoices[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
