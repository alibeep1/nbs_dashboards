// itemsNearExpiryColumns.tsx
// Column definitions for Items Near Expiry table

// itemsNearExpiryColumns.tsx
// Column definitions for Items Near Expiry table
import type { ColumnDef } from "@tanstack/react-table";
import type {
  ItemNearExpiryItem,
  StocktakingSummaryItem,
} from "./Scminventorytables.types";
import { GroupableColumnHeader } from "@/components/reusables/tables/GroupableColumnComponent";
import { ChevronDown, ChevronRight } from "lucide-react";
// import type { ItemNearExpiryItem } from "./ScmInventoryTables.types";

export const itemsNearExpiryColumns: ColumnDef<ItemNearExpiryItem>[] = [
  {
    accessorKey: "itemCode",
    header: "Item Code",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("itemCode")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({ row }) => <div className="max-w-md">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => <div>{row.getValue("warehouse")}</div>,
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("expiryDate") as string;
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "daysLeft",
    header: "Days Left",
    cell: ({ row }) => {
      const daysLeft = row.getValue("daysLeft") as number;

      // Color coding based on urgency
      let colorClass = "text-gray-700";
      let bgClass = "bg-gray-100";

      if (daysLeft <= 7) {
        colorClass = "text-red-700";
        bgClass = "bg-red-100";
      } else if (daysLeft <= 30) {
        colorClass = "text-amber-700";
        bgClass = "bg-amber-100";
      } else if (daysLeft <= 60) {
        colorClass = "text-yellow-700";
        bgClass = "bg-yellow-100";
      }

      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
          >
            {daysLeft} {daysLeft === 1 ? "day" : "days"}
          </span>
        </div>
      );
    },
  },
];

export const stocktakingSummaryColumns: ColumnDef<StocktakingSummaryItem>[] = [
  {
    accessorKey: "warehouse",
    enableGrouping: true,
    header: ({ column }) => (
      <GroupableColumnHeader
        column={column}
        title="Warehouse"
        enableFiltering={true}
        enableGrouping={true}
      />
    ),
    cell: ({ row, getValue }) => {
      const warehouse = getValue() as string;

      // If this is a grouped row, show the group value with count
      if (row.getIsGrouped()) {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={row.getToggleExpandedHandler()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">{warehouse}</span>
              <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                {row.subRows.length}{" "}
                {row.subRows.length === 1 ? "record" : "records"}
              </span>
            </div>
          </div>
        );
      }

      // Regular cell display (non-grouped)
      return <div className="font-medium">{warehouse}</div>;
    },
  },
  {
    accessorKey: "sNo",
    header: "Serial Number",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("sNo")}</div>
    ),
  },
  {
    accessorKey: "lastCount",
    header: "Last Count",
    cell: ({ row }) => {
      const dateStr = row.getValue("lastCount") as string;
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
          <span className="font-medium">{formattedDate}</span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "countedBy",
    enableGrouping: true,
    header: ({ column }) => (
      <GroupableColumnHeader
        column={column}
        title="Counted By"
        enableFiltering={true}
        enableGrouping={true}
      />
    ),
    cell: ({ row, getValue }) => {
      const email = getValue() as string;

      // If this is a grouped row, show the group value with count
      if (row.getIsGrouped()) {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={row.getToggleExpandedHandler()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-medium">{email}</span>
              <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                {row.subRows.length}{" "}
                {row.subRows.length === 1 ? "count" : "counts"}
              </span>
            </div>
          </div>
        );
      }

      // Regular cell display (non-grouped)
      return <div className="text-sm">{email}</div>;
    },
  },
  {
    accessorKey: "status",
    enableGrouping: true,
    header: ({ column }) => (
      <GroupableColumnHeader
        column={column}
        title="Status"
        enableFiltering={true}
        enableGrouping={true}
      />
    ),
    cell: ({ row, getValue }) => {
      const status = getValue() as string;

      // Determine color based on status
      let colorClass = "text-gray-700";
      let bgClass = "bg-gray-100";
      let icon = "📋";

      // Normalize status for comparison (remove extra spaces, lowercase)
      const normalizedStatus = status?.toLowerCase();

      if (
        normalizedStatus?.includes("verified") &&
        normalizedStatus?.includes("posted")
      ) {
        colorClass = "text-green-700";
        bgClass = "bg-green-100";
        icon = "✅";
      } else if (
        normalizedStatus?.includes("re-counting") ||
        normalizedStatus?.includes("back to")
      ) {
        colorClass = "text-amber-700";
        bgClass = "bg-amber-100";
        icon = "🔄";
      } else if (normalizedStatus?.includes("pending")) {
        colorClass = "text-yellow-700";
        bgClass = "bg-yellow-100";
        icon = "⏳";
      } else if (
        normalizedStatus?.includes("rejected") ||
        normalizedStatus?.includes("failed")
      ) {
        colorClass = "text-red-700";
        bgClass = "bg-red-100";
        icon = "❌";
      }

      // If this is a grouped row, show the group value with count
      if (row.getIsGrouped()) {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={row.getToggleExpandedHandler()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${colorClass} ${bgClass}`}
              >
                <span>{icon}</span>
                <span>{status}</span>
              </span>
              <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                {row.subRows.length}{" "}
                {row.subRows.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        );
      }

      // Regular cell display (non-grouped)
      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
          >
            <span>{icon}</span>
            <span>{status}</span>
          </span>
        </div>
      );
    },
  },
];

// export const stocktakingSummaryColumns: ColumnDef<StocktakingSummaryItem>[] = [
//   {
//     accessorKey: "warehouse",
//     // header: "Warehouse",
//     enableGrouping: true,
//     header: ({ column }) => (
//       <GroupableColumnHeader
//         column={column}
//         title="Warehouse"
//         enableFiltering={true}
//         enableGrouping={true}
//       />
//     ),
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue("warehouse")}</div>
//     ),
//   },
//   {
//     accessorKey: "sNo",
//     header: "Serial Number",
//     cell: ({ row }) => (
//       <div className="font-mono text-sm">{row.getValue("sNo")}</div>
//     ),
//   },
//   {
//     accessorKey: "lastCount",
//     header: "Last Count",
//     cell: ({ row }) => {
//       const dateStr = row.getValue("lastCount") as string;
//       const date = new Date(dateStr);

//       const formattedDate = date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });

//       const formattedTime = date.toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       return (
//         <div className="flex flex-col">
//           <span className="font-medium">{formattedDate}</span>
//           <span className="text-xs text-gray-500">{formattedTime}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "countedBy",
//     enableGrouping: true,
//     header: ({ column }) => (
//       <GroupableColumnHeader
//         column={column}
//         title="Counted By"
//         enableFiltering={true}
//         enableGrouping={true}
//       />
//     ),
//     cell: ({ row }) => {
//       const email = row.getValue("countedBy") as string;
//       return <div className="text-sm">{email}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     // enableGrouping: true,
//     header: ({ column }) => (
//       <GroupableColumnHeader
//         column={column}
//         title="Status"
//         enableFiltering={true}
//         enableGrouping={true}
//       />
//     ),
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;

//       // Determine color based on status
//       let colorClass = "text-gray-700";
//       let bgClass = "bg-gray-100";
//       let icon = "📋";

//       // Normalize status for comparison (remove extra spaces, lowercase)
//       const normalizedStatus = status;

//       if (
//         normalizedStatus?.includes("verified") &&
//         normalizedStatus?.includes("posted")
//       ) {
//         colorClass = "text-green-700";
//         bgClass = "bg-green-100";
//         icon = "✅";
//       } else if (
//         normalizedStatus?.includes("re-counting") ||
//         normalizedStatus?.includes("back to")
//       ) {
//         colorClass = "text-amber-700";
//         bgClass = "bg-amber-100";
//         icon = "🔄";
//       } else if (normalizedStatus?.includes("pending")) {
//         colorClass = "text-yellow-700";
//         bgClass = "bg-yellow-100";
//         icon = "⏳";
//       } else if (
//         normalizedStatus?.includes("rejected") ||
//         normalizedStatus?.includes("failed")
//       ) {
//         colorClass = "text-red-700";
//         bgClass = "bg-red-100";
//         icon = "❌";
//       }

//       return (
//         <div className="flex items-center gap-2">
//           <span
//             className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
//           >
//             <span>{icon}</span>
//             <span>{status}</span>
//           </span>
//         </div>
//       );
//     },
//   },
// ];
