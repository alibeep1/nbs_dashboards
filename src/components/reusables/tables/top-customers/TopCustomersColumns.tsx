// "use client"

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface ITopCustomer {
  customerCode: string;
  customerName: string;
  netSpend: number;
  transactions: number;
  spendPerTransaction: number;
  phoneNumber: string;
}

export interface ITopCustomerApiResponse {
  items: ITopCustomer[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const topCustomersColumns: ColumnDef<ITopCustomer>[] = [
  {
    accessorKey: "customerCode",
    header: "Code",
  },
  {
    accessorKey: "customerName",
    header: "Name",
  },
  {
    accessorKey: "netSpend",
    // header: "Last Purchase Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Net Spent (EGP)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "transactions",
    // header: "Last Visit (days ago)",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transactions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // spend per transactions
  {
    accessorKey: "spendPerTransaction",
    header: "Spend Per Transaction (EGP)",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
];
