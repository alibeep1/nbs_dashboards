// scmInterbranchTableColumns.tsx
// Column definitions for all SCM Interbranch Analytics tables

import type { ColumnDef } from "@tanstack/react-table";
import type {
  ITableTransfersWithMismatchedQty,
  ITableTransferSLACompliance,
  ITablePendingTransfersByDestination,
} from "./Scminterbranchtables.types";

// ============================================================================
// Table #12: Transfers with Mismatched Qty
// ============================================================================

export const transfersWithMismatchedQtyColumns: ColumnDef<ITableTransfersWithMismatchedQty>[] =
  [
    {
      accessorKey: "irNo",
      header: "IR Number",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue("irNo")}</div>
      ),
    },
    {
      accessorKey: "irQty",
      header: "IR Qty",
      cell: ({ row }) => {
        const value = row.getValue("irQty") as number;
        return <div className="text-gray-700">{value.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "ginQty",
      header: "GIN Qty",
      cell: ({ row }) => {
        const value = row.getValue("ginQty") as number;
        return <div className="text-gray-700">{value.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "grnQty",
      header: "GRN Qty",
      cell: ({ row }) => {
        const value = row.getValue("grnQty") as number;
        return <div className="text-gray-700">{value.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "variance",
      header: "Variance",
      cell: ({ row }) => {
        const variance = row.getValue("variance") as number;

        // Determine color based on variance
        // Negative variance = shortage (red)
        // Positive variance = surplus (amber/warning)
        // Zero = no variance (green)
        let colorClass = "text-green-700";
        let bgClass = "bg-green-100";

        if (variance < 0) {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
        } else if (variance > 0) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        }

        const displayValue =
          variance > 0
            ? `+${variance.toLocaleString()}`
            : variance.toLocaleString();

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${colorClass} ${bgClass}`}
          >
            {displayValue}
          </span>
        );
      },
    },
  ];

// ============================================================================
// Table #14: Transfer SLA Compliance
// ============================================================================

export const transferSLAComplianceColumns: ColumnDef<ITableTransferSLACompliance>[] =
  [
    {
      accessorKey: "totalRequests",
      header: "Total Requests",
      cell: ({ row }) => {
        const value = row.getValue("totalRequests") as number;
        return (
          <div className="font-semibold text-gray-900 text-lg">
            {value.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "onTimeCount",
      header: "On Time",
      cell: ({ row }) => {
        const value = row.getValue("onTimeCount") as number;
        return (
          <div className="text-green-700 font-medium">
            {value.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "onTimePercentage",
      header: "On Time %",
      cell: ({ row }) => {
        const percentage = row.getValue("onTimePercentage") as number;

        // Determine badge color based on performance
        let colorClass = "text-red-700";
        let bgClass = "bg-red-100";

        if (percentage >= 90) {
          colorClass = "text-green-700";
          bgClass = "bg-green-100";
        } else if (percentage >= 75) {
          colorClass = "text-blue-700";
          bgClass = "bg-blue-100";
        } else if (percentage >= 60) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        }

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${colorClass} ${bgClass}`}
          >
            {percentage.toFixed(1)}%
          </span>
        );
      },
    },
    {
      accessorKey: "delayedCount",
      header: "Delayed",
      cell: ({ row }) => {
        const value = row.getValue("delayedCount") as number;
        return (
          <div className="text-red-700 font-medium">
            {value.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "delayedPercentage",
      header: "Delayed %",
      cell: ({ row }) => {
        const percentage = row.getValue("delayedPercentage") as number;

        // Inverse logic: lower is better
        let colorClass = "text-red-700";
        let bgClass = "bg-red-100";

        if (percentage <= 10) {
          colorClass = "text-green-700";
          bgClass = "bg-green-100";
        } else if (percentage <= 25) {
          colorClass = "text-blue-700";
          bgClass = "bg-blue-100";
        } else if (percentage <= 40) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        }

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${colorClass} ${bgClass}`}
          >
            {percentage.toFixed(1)}%
          </span>
        );
      },
    },
  ];

// ============================================================================
// Table: Pending Transfers by Destination
// ============================================================================

export const pendingTransfersByDestinationColumns: ColumnDef<ITablePendingTransfersByDestination>[] =
  [
    {
      accessorKey: "toBranch",
      header: "Destination Branch",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("toBranch")}
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Item(s)",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("items")}</div>
      ),
    },
    {
      accessorKey: "qty",
      header: "Quantity",
      cell: ({ row }) => {
        const value = row.getValue("qty") as number;
        return (
          <div className="font-medium text-gray-900">
            {value?.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "ginDate",
      header: "GIN Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("ginDate") as string;
        const date = new Date(dateStr);

        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="text-gray-700">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "days",
      header: "Days Pending",
      cell: ({ row }) => {
        const days = row.getValue("days") as number;

        // Color coding based on urgency
        // 0-3 days: Normal (green)
        // 4-7 days: Warning (amber)
        // 8-14 days: Concerning (orange)
        // 15+ days: Critical (red)
        let colorClass = "text-gray-700";
        let bgClass = "bg-gray-100";

        if (days <= 3) {
          colorClass = "text-green-700";
          bgClass = "bg-green-100";
        } else if (days <= 7) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        } else if (days <= 14) {
          colorClass = "text-orange-700";
          bgClass = "bg-orange-100";
        } else {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
            >
              {days}
            </span>
            <span className="text-xs text-gray-500">
              {days === 1 ? "day" : "days"}
            </span>
          </div>
        );
      },
    },
  ];
