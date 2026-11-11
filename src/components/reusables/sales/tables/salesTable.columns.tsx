import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import type {
  ITableItemsInTodaysPromotions,
  ITableMarketingCampaigns,
  ITableTopSalesmen,
} from "./salesTable.types";
import { GroupableColumnHeader } from "../../tables/GroupableColumnComponent";

export const topSalesmenColumns: ColumnDef<ITableTopSalesmen>[] = [
  {
    accessorKey: "salesPersonCode",
    header: "Code",
  },
  {
    accessorKey: "salesPersonName",
    header: "Name",
  },
  {
    accessorKey: "netSalesValue",
    // header: "Last Purchase Date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Net Sales
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const status = getValue() as string;

      // Define category-specific styling
      const getCategoryStyle = (status: string) => {
        const baseClasses =
          "inline-flex items-center px-3 py-1 rounded-full font-bold";

        return `${baseClasses}  text-green-700 `;
      };

      return <span className={getCategoryStyle(status)}>{status}</span>;
    },
  },
  {
    accessorKey: "transactions",
    header: "Transactions",
  },
  {
    accessorKey: "avgTransactionValue",
    header: "Avg. Transaction Value",
  },
  {
    accessorKey: "branchCode",
    header: "Branch Code",
  },
  { accessorKey: "branchName", header: "Branch Name" },
];

export const itemsInTodaysPromoColumns: ColumnDef<ITableItemsInTodaysPromotions>[] =
  [
    {
      accessorKey: "itemCode",
      header: "Item Code",
    },
    {
      accessorKey: "itemName",
      header: "Item Name",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => {
        const category = getValue() as string;

        // Define category-specific styling
        const getCategoryStyle = (category: string) => {
          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";

          return `${baseClasses} bg-blue-100 text-blue-800 border`;
        };

        return <span className={getCategoryStyle(category)}>{category}</span>;
      },
    },
  ];

export const marketingCampaignsColumns: ColumnDef<ITableMarketingCampaigns>[] =
  [
    {
      accessorKey: "campaignCode",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Code"
          enableGrouping={false} // Only filtering, no grouping
        />
      ),
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "campaignName",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Name"
          enableGrouping={false}
        />
      ),
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Status"
          enableGrouping={true} // Both filtering AND grouping
          enableFiltering={true}
        />
      ),
      enableGrouping: true,
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
      cell: ({ row, getValue }) => {
        const status = getValue() as string;

        const getCategoryStyle = (status: string) => {
          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";

          switch (status.toLowerCase()) {
            case "approved":
              return `${baseClasses} bg-green-100 text-green-800 border`;
            case "draft":
              return `${baseClasses} bg-yellow-100 text-yellow-800 border`;
            case "rejected":
              return `${baseClasses} bg-red-100 text-red-800 border`;
            case "blocked":
              return `${baseClasses} bg-gray-100 text-gray-800 border`;
            default:
              return `${baseClasses} bg-blue-100 text-blue-800 border`;
          }
        };

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
              <span className={getCategoryStyle(status)}>{status}</span>
              <span className="text-sm text-gray-600 font-medium">
                ({row.subRows.length})
              </span>
            </div>
          );
        }

        return <span className={getCategoryStyle(status)}>{status}</span>;
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Type"
          enableGrouping={false}
        />
      ),
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Created By"
          enableGrouping={false}
        />
      ),
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "createdOn",
      header: "Created On",
    },
  ];

// export const marketingCampaignsColumns: ColumnDef<ITableMarketingCampaigns>[] =
//   [
//     {
//       accessorKey: "campaignCode",
//       header: "Code",
//     },
//     {
//       accessorKey: "campaignName",
//       header: "Name",
//     },
//     {
//       accessorKey: "status",
//       header: ({ column }) => (
//         <GroupableColumnHeader column={column} title="Status" />
//       ),
//       enableGrouping: true,
//       cell: ({ row, getValue }) => {
//         const status = getValue() as string;

//         // Define category-specific styling
//         const getCategoryStyle = (status: string) => {
//           const baseClasses =
//             "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";

//           switch (status.toLowerCase()) {
//             case "approved":
//               return `${baseClasses} bg-green-100 text-green-800 border`;
//             case "draft":
//               return `${baseClasses} bg-yellow-100 text-yellow-800 border`;
//             case "rejected":
//               return `${baseClasses} bg-red-100 text-red-800 border`;
//             case "blocked":
//               return `${baseClasses} bg-gray-100 text-gray-800 border`;
//             default:
//               return `${baseClasses} bg-blue-100 text-blue-800 border`;
//           }
//         };

//         // If this is a grouped row, show the group value with count
//         if (row.getIsGrouped()) {
//           return (
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={row.getToggleExpandedHandler()}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 {row.getIsExpanded() ? (
//                   <ChevronDown className="w-4 h-4" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4" />
//                 )}
//               </button>
//               <span className={getCategoryStyle(status)}>{status}</span>
//               <span className="text-sm text-gray-600 font-medium">
//                 ({row.subRows.length})
//               </span>
//             </div>
//           );
//         }

//         // Regular cell display (non-grouped)
//         return <span className={getCategoryStyle(status)}>{status}</span>;
//       },
//     },
//     // {
//     //   accessorKey: "status",
//     //   header: "Status",
//     //   cell: ({ getValue }) => {
//     //     const status = getValue() as string;

//     //     // Define category-specific styling
//     //     const getCategoryStyle = (status: string) => {
//     //       const baseClasses =
//     //         "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";

//     //       // switch over status
//     //       switch (status.toLowerCase()) {
//     //         case "approved":
//     //           return `${baseClasses} bg-green-100 text-green-800 border`;
//     //         case "draft":
//     //           return `${baseClasses} bg-yellow-100 text-yellow-800 border`;
//     //         case "rejected":
//     //           return `${baseClasses} bg-red-100 text-red-800 border`;
//     //         case "blocked":
//     //           return `${baseClasses} bg-gray-100 text-gray-800 border`;

//     //         // default case
//     //         default:
//     //           return `${baseClasses} bg-blue-100 text-blue-800 border`;
//     //       }
//     //     };

//     //     return <span className={getCategoryStyle(status)}>{status}</span>;
//     //   },
//     // },
//     {
//       accessorKey: "type",
//       header: "Type",
//     },
//     {
//       accessorKey: "startDate",
//       header: "Start Date",
//     },
//     {
//       accessorKey: "createdBy",
//       header: "Created By",
//     },
//     { accessorKey: "createdOn", header: "Created On" },
//   ];
