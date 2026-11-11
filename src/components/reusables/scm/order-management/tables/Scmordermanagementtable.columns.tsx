// scmOrderManagementTableColumns.tsx
// Column definitions for all SCM Order Management Analytics tables

import type { ColumnDef } from "@tanstack/react-table";
import type {
  ITablePendingIRs,
  ITablePOsAwaitingApproval,
} from "./Scmordermanagementtables.types";

// ============================================================================
// Table #10: Pending IRs
// ============================================================================

export const pendingIRsColumns: ColumnDef<ITablePendingIRs>[] = [
  {
    accessorKey: "sno",
    header: "IR Number",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("sno")}</div>
    ),
  },
  {
    accessorKey: "forBranch",
    header: "For Branch",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("forBranch")}</div>
    ),
  },
  {
    accessorKey: "totalItems",
    header: "Total Items",
    cell: ({ row }) => {
      const value = row.getValue("totalItems") as number;
      return (
        <div className="font-medium text-gray-900">
          {value.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("date") as string;
      const date = new Date(dateStr);

      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{formattedDate}</span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "irIntoPO",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("irIntoPO") as string;

      // Determine badge color based on status
      // Adjust these conditions based on your actual status values
      let colorClass = "text-gray-700";
      let bgClass = "bg-gray-100";

      const normalizedStatus = status?.toLowerCase();

      if (
        normalizedStatus?.includes("converted") ||
        normalizedStatus?.includes("complete") ||
        normalizedStatus?.includes("yes")
      ) {
        colorClass = "text-green-700";
        bgClass = "bg-green-100";
      } else if (
        normalizedStatus?.includes("pending") ||
        normalizedStatus?.includes("no") ||
        normalizedStatus?.includes("waiting")
      ) {
        colorClass = "text-amber-700";
        bgClass = "bg-amber-100";
      } else if (
        normalizedStatus?.includes("partial") ||
        normalizedStatus?.includes("progress")
      ) {
        colorClass = "text-blue-700";
        bgClass = "bg-blue-100";
      }

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
        >
          {status}
        </span>
      );
    },
  },
];

// ============================================================================
// Table #12: POs Awaiting Approval
// ============================================================================

export const posAwaitingApprovalColumns: ColumnDef<ITablePOsAwaitingApproval>[] =
  [
    {
      accessorKey: "sno",
      header: "PO Number",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue("sno")}</div>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("vendor")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;

        // Format as currency
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EGP", // Adjust currency as needed
          minimumFractionDigits: 2,
        }).format(amount);

        return <div className="font-semibold text-gray-900">{formatted}</div>;
      },
    },
    {
      accessorKey: "totalItems",
      header: "Total Items",
      cell: ({ row }) => {
        const value = row.getValue("totalItems") as number;
        return (
          <div className="font-medium text-gray-900">
            {value.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => {
        const email = row.getValue("createdBy") as string;
        return <div className="text-sm text-gray-700">{email}</div>;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("date") as string;
        const date = new Date(dateStr);

        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Calculate days since creation
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Color code by age
        let ageColorClass = "text-gray-600";
        if (diffDays >= 7) {
          ageColorClass = "text-red-600"; // Very old
        } else if (diffDays >= 3) {
          ageColorClass = "text-amber-600"; // Getting old
        } else if (diffDays >= 1) {
          ageColorClass = "text-blue-600"; // Recent
        }

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{formattedDate}</span>
            <span className="text-xs text-gray-500">{formattedTime}</span>
            <span className={`text-xs font-medium ${ageColorClass} mt-1`}>
              {diffDays === 0
                ? "Today"
                : diffDays === 1
                ? "1 day ago"
                : `${diffDays} days ago`}
            </span>
          </div>
        );
      },
    },
  ];
