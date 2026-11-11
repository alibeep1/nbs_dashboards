// "use client"

import type { ColumnDef } from "@tanstack/react-table";
// import type { IChurnCustomer } from "./ChurnCustomersTypes";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface IItemPair {
  item1Code: string;
  item1Name: string;
  item2Code: string;
  item2Name: string;
  frequency: number;
}

export interface IItemPairApiResponse {
  items: IItemPair[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const itemPairsColumns: ColumnDef<IItemPair>[] = [
  {
    accessorKey: "item1Code",
    header: "Item 1 Code",
  },
  {
    accessorKey: "item1Name",
    header: "Item 1 Name",
  },
  {
    accessorKey: "item2Code",
    header: "Item 2 Code",
  },
  {
    accessorKey: "item2Name",
    header: "Item 2 Name",
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
