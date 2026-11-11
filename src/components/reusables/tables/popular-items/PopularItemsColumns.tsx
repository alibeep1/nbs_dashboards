// "use client"

import type { ColumnDef } from "@tanstack/react-table";
// import type { IChurnCustomer } from "./ChurnCustomersTypes";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface IPopularItem {
  itemCode: string;
  itemName: string;
  totalSold: number;
  frequency: number;
}

export interface IPopularItemApiResponse {
  items: IPopularItem[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const popularItemsColumns: ColumnDef<IPopularItem>[] = [
  {
    accessorKey: "itemCode",
    header: "Code",
  },
  {
    accessorKey: "itemName",
    header: "Name",
  },
  {
    accessorKey: "totalSold",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Frequency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
