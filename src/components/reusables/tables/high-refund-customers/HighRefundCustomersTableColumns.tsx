// "use client"

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { IHighRefundCustomer } from "./HighRefundCustomersTypes";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const highRefundCustomersColumns: ColumnDef<IHighRefundCustomer>[] = [
  {
    accessorKey: "customerCode",
    header: "Code",
  },
  {
    accessorKey: "customerName",
    header: "Name",
  },
  {
    accessorKey: "numberOfRefunds",
    // header: "Last Purchase Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Refunds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "branchNameOfLastRefund",
    // header: "Last Visit (days ago)",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Refund Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // Serial Number of Last Refund
  {
    accessorKey: "docNumberofLastRefund",
    header: "Last Refund Serial Number",
  },
  {
    accessorKey: "dateOfLastRefund",
    // header: "Last Purchase Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Last Refund
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
];
