export interface ISuspectedDuplicateItems {
  itemCode1: string;
  itemName1: string;
  itemCode2: string;
  itemName2: string;
  similarityScore: number;
}

export interface ITableSuspectedDuplicateItemsApiResponse {
  items: ISuspectedDuplicateItems[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IMissingImportantFields {
  itemCode: string;
  itemName: string;
  missingFields: string;
}

export interface ITableMissingImportantFieldsApiResponse {
  items: IMissingImportantFields[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
