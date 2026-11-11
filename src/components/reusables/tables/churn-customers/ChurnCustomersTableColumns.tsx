// "use client"

import type { ColumnDef } from "@tanstack/react-table";
import type { IChurnCustomer } from "./ChurnCustomersTypes";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const churnCustomersColumns: ColumnDef<IChurnCustomer>[] = [
  {
    accessorKey: "customerCode",
    header: "Code",
  },
  {
    accessorKey: "customerName",
    header: "Name",
  },
  {
    accessorKey: "lastPurchaseDate",
    // header: "Last Purchase Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Purchase Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastVisit",
    // header: "Last Visit (days ago)",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Visit (days ago)
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
