export interface IChurnCustomer {
  customerCode: string;
  customerName: string;
  lastPurchaseDate: string;
  lastVisit: number;
  phoneNumber: string;
}

export interface ServerPaginationData {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IChurnCustomerApiResponse {
  items: IChurnCustomer[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const _mockChurnCustomersData: IChurnCustomerApiResponse = {
  items: [
    {
      customerCode: "1001",
      customerName: "Ahmed Mohammed A.....",
      lastPurchaseDate: "2025-02-01",
      lastVisit: 178,
      phoneNumber: "01064658014",
    },
    {
      customerCode: "1002",
      customerName: "Ali Hassan B",
      lastPurchaseDate: "2025-01-15",
      lastVisit: 200,
      phoneNumber: "01012345678",
    },
    {
      customerCode: "1003",
      customerName: "Sara Ali C",
      lastPurchaseDate: "2024-12-20",
      lastVisit: 220,
      phoneNumber: "01123456789",
    },
    {
      customerCode: "1004",
      customerName: "Mohamed Ehab D",
      lastPurchaseDate: "2024-11-10",
      lastVisit: 250,
      phoneNumber: "01234567890",
    },
    {
      customerCode: "1005",
      customerName: "Fatma Youssef E",
      lastPurchaseDate: "2024-10-05",
      lastVisit: 300,
      phoneNumber: "01345678901",
    },
  ],
  pageIndex: 1,
  totalPages: 1,
  count: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};
