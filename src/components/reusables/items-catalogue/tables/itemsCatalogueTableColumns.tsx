import type { ColumnDef } from "@tanstack/react-table";
import type {
  ISuspectedDuplicateItems,
  IMissingImportantFields,
} from "./itemsCatalogueTable.types";
import { ChevronDown, ChevronRight, Layers } from "lucide-react";
import { GroupableColumnHeader } from "../../tables/GroupableColumnComponent";

export const suspectedDuplicateItemsColumns: ColumnDef<ISuspectedDuplicateItems>[] =
  [
    {
      accessorKey: "itemCode1",
      header: "Item Code 1",
    },
    {
      accessorKey: "itemName1",
      header: "Item Name 1",
    },
    {
      accessorKey: "itemCode2",
      header: "Item Code 2",
    },
    {
      accessorKey: "itemName2",
      header: "Item Name 2",
    },
    {
      accessorKey: "similarityScore",
      header: "Similarity Score",
      cell: ({ getValue }) => {
        const score = getValue() as number;

        // Define score-specific styling
        const getScoreStyle = (score: number) => {
          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full font-medium";

          if (score >= 0.9) {
            return `${baseClasses} bg-red-100 text-red-700`; // Very High similarity
          } else if (score >= 0.8) {
            return `${baseClasses} bg-orange-100 text-orange-700`; // High similarity
          } else if (score >= 0.7) {
            return `${baseClasses} bg-yellow-100 text-yellow-700`; // Medium similarity
          } else {
            return `${baseClasses} bg-blue-100 text-blue-700`; // Lower similarity
          }
        };

        return (
          <span className={getScoreStyle(score)}>
            {(score * 100).toFixed(0)}%
          </span>
        );
      },
    },
  ];

export const missingImportantFieldsColumns: ColumnDef<IMissingImportantFields>[] =
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
      accessorKey: "missingFields",
      header: ({ column }) => (
        <GroupableColumnHeader
          column={column}
          title="Missing Fields"
          enableFiltering={true}
        />
      ),
      enableGrouping: true,
      cell: ({ row, getValue }) => {
        const fields = getValue() as string;

        // If this is a grouped row, show the group value with count
        if (row.getIsGrouped()) {
          const fieldCount = fields
            .split(",")
            .filter((field) => field.trim()).length;

          const getFieldsStyle = (count: number) => {
            const baseClasses =
              "inline-flex items-center px-3 py-1 rounded-full font-medium text-sm";

            if (count >= 3) {
              return `${baseClasses} bg-red-100 text-red-700`;
            } else if (count >= 2) {
              return `${baseClasses} bg-orange-100 text-orange-700`;
            } else {
              return `${baseClasses} bg-yellow-100 text-yellow-700`;
            }
          };

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
              <div className="flex flex-col gap-1">
                <span className={getFieldsStyle(fieldCount)}>
                  {fieldCount} field{fieldCount !== 1 ? "s" : ""} missing
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  ({row.subRows.length} items)
                </span>
              </div>
            </div>
          );
        }

        // Regular cell display (non-grouped)
        const fieldCount = fields
          .split(",")
          .filter((field) => field.trim()).length;

        const getFieldsStyle = (count: number) => {
          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full font-medium text-sm";

          if (count >= 3) {
            return `${baseClasses} bg-red-100 text-red-700`;
          } else if (count >= 2) {
            return `${baseClasses} bg-orange-100 text-orange-700`;
          } else {
            return `${baseClasses} bg-yellow-100 text-yellow-700`;
          }
        };

        return (
          <div className="flex flex-col gap-1">
            <span className={getFieldsStyle(fieldCount)}>
              {fieldCount} field{fieldCount !== 1 ? "s" : ""} missing
            </span>
            <span
              className="text-xs text-gray-600 truncate max-w-xs"
              title={fields}
            >
              {fields}
            </span>
          </div>
        );
      },
    },
  ];
// export const missingImportantFieldsColumns: ColumnDef<IMissingImportantFields>[] =
//   [
//     {
//       accessorKey: "itemCode",
//       header: "Item Code",
//     },
//     {
//       accessorKey: "itemName",
//       header: "Item Name",
//     },
//     {
//       accessorKey: "missingFields",
//       header: "Missing Fields",
//       cell: ({ getValue }) => {
//         const fields = getValue() as string;

//         // Count the number of missing fields by counting commas
//         const fieldCount = fields
//           .split(",")
//           .filter((field) => field.trim()).length;

//         // Define styling based on number of missing fields
//         const getFieldsStyle = (count: number) => {
//           const baseClasses =
//             "inline-flex items-center px-3 py-1 rounded-full font-medium text-sm";

//           if (count >= 3) {
//             return `${baseClasses} bg-red-100 text-red-700`; // Critical - many fields missing
//           } else if (count >= 2) {
//             return `${baseClasses} bg-orange-100 text-orange-700`; // High - multiple fields missing
//           } else {
//             return `${baseClasses} bg-yellow-100 text-yellow-700`; // Medium - few fields missing
//           }
//         };

//         return (
//           <div className="flex flex-col gap-1">
//             <span className={getFieldsStyle(fieldCount)}>
//               {fieldCount} field{fieldCount !== 1 ? "s" : ""} missing
//             </span>
//             <span
//               className="text-xs text-gray-600 truncate max-w-xs"
//               title={fields}
//             >
//               {fields}
//             </span>
//           </div>
//         );
//       },
//     },
//   ];
