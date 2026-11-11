export interface IHighRefundCustomer {
  customerCode: string;
  customerName: string;
  numberOfRefunds: number;
  branchCodeOfLastRefund: string;
  branchNameOfLastRefund: string;
  docNumberofLastRefund: number;
  dateOfLastRefund: string;
  phoneNumber: string;
}

export interface IHighRefundCustomerApiResponse {
  items: IHighRefundCustomer[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const _mockHighRefundCustomerData: IHighRefundCustomerApiResponse = {
  items: [
    {
      customerCode: "10069",
      customerName: "Ali Ashraf Ali",
      numberOfRefunds: 2,
      branchCodeOfLastRefund: "100",
      branchNameOfLastRefund: "المقر الرئيسي",
      docNumberofLastRefund: 251.0,
      dateOfLastRefund: "2025-07-25",
      phoneNumber: "01159555164",
    },
    {
      customerCode: "10070",
      customerName: "Ahmed Mohamed Ahmed",
      numberOfRefunds: 3,
      branchCodeOfLastRefund: "101",
      branchNameOfLastRefund: "فرع المعادي",
      docNumberofLastRefund: 300.0,
      dateOfLastRefund: "2025-07-26",
      phoneNumber: "01012345678",
    },
  ],
  pageIndex: 1,
  totalPages: 1,
  count: 2,
  hasPreviousPage: false,
  hasNextPage: false,
};
