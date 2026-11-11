import type { ColumnDef } from "@tanstack/react-table";
import type {
  ICorpClaimedInvoices,
  ITableCorpInvoiceAging,
} from "./corpSalesTable.types";

export const corpInvoiceAgingColumns: ColumnDef<ITableCorpInvoiceAging>[] = [
  {
    accessorKey: "invoiceNo",
    header: "Invoice #",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "invoiceDate",
    header: "Date Issued",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  { accessorKey: "daysOverdue", header: "Days Overdue" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      // Define status-specific styling
      const getStatusStyle = (status: string) => {
        const baseClasses =
          "inline-flex items-center px-3 py-1 rounded-full font-medium";

        // Convert to lowercase for consistent comparison
        const normalizedStatus = status?.toLowerCase();

        switch (normalizedStatus) {
          case "low (0-25%)":
            return `${baseClasses} bg-green-100 text-green-700`;
          case "medium (25-50%)":
            return `${baseClasses} bg-blue-100 text-blue-700`;
          case "high (50-75%)":
            return `${baseClasses} bg-orange-100 text-orange-700`;
          case "important (75-90%)":
            return `${baseClasses} bg-orange-100 text-orange-700`;
          case "critical (90-100%)":
            return `${baseClasses} bg-red-100 text-red-700 `;

          default:
            return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
        }
      };

      return <span className={getStatusStyle(status)}>{status}</span>;
    },
  },
];

export const corpClaimedInvoiceStatusColumns: ColumnDef<ICorpClaimedInvoices>[] =
  [
    {
      accessorKey: "invoiceNo",
      header: "Invoice #",
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "documentDate",
      header: "Date",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ getValue }) => {
        const status = getValue() as string;
        // Define status-specific styling
        const getStatusStyle = (status: string) => {
          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full font-medium";

          // Convert to lowercase for consistent comparison
          const normalizedStatus = status?.toLowerCase();

          switch (normalizedStatus) {
            case "paid":
              return `${baseClasses} bg-blue-100 text-blue-700`;
            case "partial":
              return `${baseClasses} bg-orange-100 text-orange-700`;
            case "unpaid":
              return `${baseClasses} bg-red-100 text-red-700 `;
            case "important (75-90%)":
              return `${baseClasses} bg-orange-100 text-orange-700`;
            case "critical (90-100%)":
              return `${baseClasses} bg-red-100 text-red-700 `;

            default:
              return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
          }
        };

        return <span className={getStatusStyle(status)}>{status}</span>;
      },
    },
  ];
